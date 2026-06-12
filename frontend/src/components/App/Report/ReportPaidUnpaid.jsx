import React, { useState, useMemo } from "react";
import { Search, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Users, FileText, ArrowRight } from "lucide-react";

export const ReportPaidUnpaid = ({ sales, purchases }) => {
  const [partyType, setPartyType] = useState("sales"); // "sales" (Customers) or "purchases" (Suppliers)
  const [statusFilter, setStatusFilter] = useState("unpaid"); // "all", "paid", "unpaid"
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate outstanding KPI metrics
  const kpis = useMemo(() => {
    let totalReceivables = 0;
    let totalPayables = 0;
    let unpaidSalesCount = 0;
    let unpaidPurchasesCount = 0;

    sales.forEach((s) => {
      const bal = Math.max(0, s.grandTotal - s.paidAmount);
      if (bal > 0) {
        totalReceivables += bal;
        unpaidSalesCount++;
      }
    });

    purchases.forEach((p) => {
      const bal = Math.max(0, p.grandTotal - p.paidAmount);
      if (bal > 0) {
        totalPayables += bal;
        unpaidPurchasesCount++;
      }
    });

    return { totalReceivables, totalPayables, unpaidSalesCount, unpaidPurchasesCount };
  }, [sales, purchases]);

  // Map and filter active transactions based on criteria
  const filteredTransactions = useMemo(() => {
    const list = partyType === "sales" ? sales : purchases;
    
    // Sort chronologically (newest first)
    let processed = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Status filter
    if (statusFilter === "paid") {
      processed = processed.filter(t => t.isPaid || (t.grandTotal - t.paidAmount) <= 0);
    } else if (statusFilter === "unpaid") {
      processed = processed.filter(t => !t.isPaid && (t.grandTotal - t.paidAmount) > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      processed = processed.filter(
        t =>
          t.partyName?.toLowerCase().includes(query) ||
          t.invoiceNo?.toLowerCase().includes(query)
      );
    }

    return processed;
  }, [sales, purchases, partyType, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 text-gray-800 dark:text-white">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KPI 1: Total Receivables (Sales) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Customer Receivables</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{kpis.totalReceivables.toFixed(2)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Pending from {kpis.unpaidSalesCount} invoices</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950">
            <TrendingUp className="size-5" />
          </div>
        </div>

        {/* KPI 2: Total Payables (Purchases) */}
        <div className="bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Supplier Payables</p>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">₹{kpis.totalPayables.toFixed(2)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Due on {kpis.unpaidPurchasesCount} bills</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 p-2.5 rounded-lg text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-950">
            <TrendingDown className="size-5" />
          </div>
        </div>
      </div>

      {/* Toggle Controls Panel */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-250 dark:border-gray-700 shadow-xs space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Party type selector: Customers vs Suppliers */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-semibold self-start">
            <button
              onClick={() => {
                setPartyType("sales");
                setSearchQuery("");
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all cursor-pointer ${
                partyType === "sales"
                  ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Users size={14} /> Customers (Sales)
            </button>
            <button
              onClick={() => {
                setPartyType("purchases");
                setSearchQuery("");
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all cursor-pointer ${
                partyType === "purchases"
                  ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Users size={14} /> Suppliers (Purchases)
            </button>
          </div>

          {/* Payment Status Toggle Filter */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-semibold self-start">
            <button
              onClick={() => setStatusFilter("unpaid")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                statusFilter === "unpaid"
                  ? "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <AlertCircle size={13} /> Unpaid / Partial
            </button>
            <button
              onClick={() => setStatusFilter("paid")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                statusFilter === "paid"
                  ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <CheckCircle size={13} /> Fully Paid
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <FileText size={13} /> All Bills
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${partyType === "sales" ? "customers" : "suppliers"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-250 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50/50 dark:bg-gray-900 placeholder-gray-400 transition-all text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Transactions Table list */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/75 dark:bg-gray-700/50 uppercase text-[10px] tracking-wider font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-750">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Ref No</th>
                <th className="px-4 py-3">{partyType === "sales" ? "Customer Name" : "Supplier Name"}</th>
                <th className="px-4 py-3 text-right">Invoice Amount</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-right">Outstanding Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            {filteredTransactions.length > 0 ? (
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                {filteredTransactions.map((t, idx) => {
                  const balance = Math.max(0, t.grandTotal - t.paidAmount);
                  const isFullyPaid = balance <= 0 || t.isPaid;
                  
                  return (
                    <tr key={t._id || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 font-medium">
                        {t.date?.split("T")[0] || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-900 dark:text-white font-semibold">
                        {t.invoiceNo}
                      </td>
                      <td className="px-4 py-3.5 text-gray-900 dark:text-white font-bold">
                        {t.partyName}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-gray-800 dark:text-gray-300">
                        ₹ {t.grandTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-emerald-600 dark:text-emerald-450">
                        ₹ {t.paidAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-red-650 dark:text-red-400">
                        ₹ {balance.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isFullyPaid
                              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50"
                              : balance < t.grandTotal
                                ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
                                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50"
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              isFullyPaid ? "bg-green-500" : balance < t.grandTotal ? "bg-amber-500" : "bg-red-500"
                            }`} />
                            {isFullyPaid ? "Paid" : balance < t.grandTotal ? "Partial" : "Unpaid"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-14 text-center text-gray-400">
                      <FileText className="size-14 text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="font-semibold text-gray-700 dark:text-gray-300">No records found</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Try modifying your search query or status filter.
                      </p>
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

export default ReportPaidUnpaid;
