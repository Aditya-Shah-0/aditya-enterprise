import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, Truck, Calendar, AlertTriangle, CheckCircle2,
  Search, X, Eye, FileSpreadsheet, RefreshCw
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { transactionService } from "../../../services/transactionService";
import { purchaseService } from "../../../services/purchaseService";
import toast, { Toaster } from "react-hot-toast";

export const DuesDeliveryDashboard = () => {
  const navigate = useNavigate();
  const { transaction, purchases, refreshTransactions, refreshPurchases } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Pending, Delivered, Overdue
  const [typeFilter, setTypeFilter] = useState("All"); // All, Sales, Purchases
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Consolidate Sales & Purchases
  const allOrders = useMemo(() => {
    const salesList = (transaction?.transactions || []).map(item => ({
      ...item,
      orderType: "sale",
      partyLabel: "Customer",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      routePrefix: "/app/sale"
    }));

    const purchasesList = (purchases?.purchases || []).map(item => ({
      ...item,
      orderType: "purchase",
      partyLabel: "Supplier",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
      routePrefix: "/app/purchase"
    }));

    return [...salesList, ...purchasesList];
  }, [transaction, purchases]);

  // Compute stats on entire list
  const stats = useMemo(() => {
    let overdueCount = 0;
    let overdueSum = 0;
    let pendingCount = 0;
    let pendingSum = 0;
    let deliveredCount = 0;
    let deliveredSum = 0;

    allOrders.forEach(order => {
      const isDelivered = order.deliveryStatus === "Delivered";
      const due = order.dueDate ? new Date(order.dueDate) : null;

      if (isDelivered) {
        deliveredCount++;
        deliveredSum += order.grandTotal || 0;
      } else {
        const isOverdue = due && due < today;
        if (isOverdue) {
          overdueCount++;
          overdueSum += order.grandTotal || 0;
        } else {
          pendingCount++;
          pendingSum += order.grandTotal || 0;
        }
      }
    });

    const totalCount = allOrders.length;
    const deliveryRate = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 0;

    return {
      overdueCount, overdueSum,
      pendingCount, pendingSum,
      deliveredCount, deliveredSum,
      deliveryRate
    };
  }, [allOrders, today]);

  // Handle Delivery Status Toggle
  const handleToggleStatus = async (order) => {
    const newStatus = order.deliveryStatus === "Delivered" ? "Pending" : "Delivered";
    setUpdatingId(order._id);

    try {
      if (order.orderType === "sale") {
        await transactionService.updateDeliveryStatus(order._id, newStatus);
        await refreshTransactions();
      } else {
        await purchaseService.updateDeliveryStatus(order._id, newStatus);
        await refreshPurchases();
      }
      toast.success(`Order ${order.invoiceNo} marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update delivery status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      // 1. Search filter
      const matchesSearch =
        order.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.partyName?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Type filter
      if (typeFilter === "Sales" && order.orderType !== "sale") return false;
      if (typeFilter === "Purchases" && order.orderType !== "purchase") return false;

      // 3. Status filter
      const due = order.dueDate ? new Date(order.dueDate) : null;
      const isOverdue = !order.deliveryStatus || order.deliveryStatus === "Pending" ? (due && due < today) : false;

      if (statusFilter === "Delivered" && order.deliveryStatus !== "Delivered") return false;
      if (statusFilter === "Pending" && (order.deliveryStatus === "Delivered" || isOverdue)) return false;
      if (statusFilter === "Overdue" && !isOverdue) return false;

      // 4. Date filter (based on dueDate for pending/overdue, or deliveryDate/dueDate for delivered)
      const dateToCompare = order.deliveryStatus === "Delivered" && order.deliveryDate
        ? new Date(order.deliveryDate)
        : new Date(order.dueDate);

      dateToCompare.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (dateToCompare < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (dateToCompare > end) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by closest due date first
  }, [allOrders, searchTerm, statusFilter, typeFilter, startDate, endDate, today]);

  // Days left calculation
  const getDeliveryTimeline = (order) => {
    if (order.deliveryStatus === "Delivered") {
      const delDateStr = order.deliveryDate ? order.deliveryDate.split("T")[0] : "Completed";
      return {
        label: `Delivered (${delDateStr})`,
        color: "text-emerald-600 font-semibold"
      };
    }

    if (!order.dueDate) return { label: "N/A", color: "text-gray-400" };

    const due = new Date(order.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const days = Math.abs(diffDays);
      return {
        label: `Overdue by ${days} day${days > 1 ? "s" : ""}`,
        color: "text-red-600 font-bold animate-pulse"
      };
    } else if (diffDays === 0) {
      return {
        label: "Deliver Today",
        color: "text-amber-600 font-bold"
      };
    } else {
      return {
        label: `${diffDays} day${diffDays > 1 ? "s" : ""} left`,
        color: "text-gray-650 font-medium"
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 text-black flex flex-col w-full">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="text-blue-600" /> Dues & Delivery Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track outstanding balances, follow-up timeline metrics, and toggle order delivery states.</p>
        </div>
        <button
          onClick={async () => {
            await Promise.all([refreshTransactions(), refreshPurchases()]);
            toast.success("State refreshed successfully!");
          }}
          className="flex items-center gap-1.5 self-start bg-white border border-gray-200 hover:bg-gray-100 px-3.5 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* KPI stats section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Overdue Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Overdue Deliveries</p>
            <h3 className="text-xl font-black text-gray-900 mt-1">{stats.overdueCount}</h3>
            <p className="text-[11px] font-bold text-red-500 mt-0.5">₹ {stats.overdueSum.toFixed(2)}</p>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">To Be Delivered</p>
            <h3 className="text-xl font-black text-gray-900 mt-1">{stats.pendingCount}</h3>
            <p className="text-[11px] font-bold text-amber-600 mt-0.5">₹ {stats.pendingSum.toFixed(2)}</p>
          </div>
        </div>

        {/* Delivered Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Delivered Orders</p>
            <h3 className="text-xl font-black text-gray-900 mt-1">{stats.deliveredCount}</h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-0.5">₹ {stats.deliveredSum.toFixed(2)}</p>
          </div>
        </div>

        {/* Delivery Rate Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileSpreadsheet className="size-6" />
          </div>
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Delivery Success Rate</p>
            <h3 className="text-xl font-black text-gray-900 mt-1">{stats.deliveryRate.toFixed(1)}%</h3>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.deliveryRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters section card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

          {/* Left: Search input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search by Bill/Invoice No or Party Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right: Date Range filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Calendar size={14} /> Filter Date:
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              title="Start Date filter boundary"
            />
            <span className="text-gray-400 text-xs font-bold">TO</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              title="End Date filter boundary"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Reset Dates
              </button>
            )}
          </div>

        </div>

        {/* Bottom row of filter buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">

          {/* Status Tabs */}
          <div className="flex gap-1.5 bg-gray-50 p-1 border border-gray-150 rounded-lg text-xs font-semibold">
            {["All", "Pending", "Delivered", "Overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${statusFilter === status
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200 font-bold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Type Filters */}
          <div className="flex gap-1.5 bg-gray-50 p-1 border border-gray-150 rounded-lg text-xs font-semibold">
            {["All", "Sales", "Purchases"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${typeFilter === type
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200 font-bold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Grid table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/75 uppercase text-[10px] tracking-wider font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Invoice / Bill No</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Party Name</th>
                <th className="px-4 py-3 text-right">Grand Total</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Timeline Status</th>
                <th className="px-4 py-3 text-center">Delivery Action</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            {filteredOrders && filteredOrders.length > 0 ? (
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order, idx) => {
                  const timeline = getDeliveryTimeline(order);
                  return (
                    <tr key={order._id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900">{order.invoiceNo}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-bold border ${order.badgeColor}`}>
                          {order.orderType === "sale" ? "Sale" : "Purchase"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-gray-900">{order.partyName}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{order.partyLabel}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-black text-gray-900">
                        ₹ {(order.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {order.dueDate ? order.dueDate.split("T")[0] : "-"}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold">
                        <span className={timeline.color}>{timeline.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleStatus(order)}
                          disabled={updatingId === order._id}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${order.deliveryStatus === "Delivered"
                              ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                            }`}
                        >
                          {updatingId === order._id ? (
                            <span className="inline-block animate-spin size-3 border-2 border-current border-t-transparent rounded-full" />
                          ) : order.deliveryStatus === "Delivered" ? (
                            "Mark Pending"
                          ) : (
                            "Mark Delivered"
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => navigate(`${order.routePrefix}/view/${order._id}`)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="View Transaction Details"
                          >
                            <Eye className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="8">
                    <div className="flex flex-col items-center justify-center py-16 text-center w-full text-gray-400">
                      <Truck className="size-16 mb-3 text-gray-300 animate-bounce" />
                      <p className="font-bold text-gray-750 text-base">No orders found matching filters</p>
                      <p className="text-xs mt-1">Adjust search parameters or status toggle filter criteria</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DuesDeliveryDashboard;
