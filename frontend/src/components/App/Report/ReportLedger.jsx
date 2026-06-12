import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Receipt, Eye, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const ReportLedger = ({ sales, purchases, navigate }) => {
  const [expandedDates, setExpandedDates] = useState({});

  // Merge, sort, and group transactions by day
  const groupedTimeline = useMemo(() => {
    const salesMapped = sales.map((s) => ({ ...s, txnType: "sale" }));
    const purchasesMapped = purchases.map((p) => ({ ...p, txnType: "purchase" }));

    const merged = [...salesMapped, ...purchasesMapped].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const groups = {};
    merged.forEach((txn) => {
      const dateStr = txn.date?.split("T")[0] || "N/A";
      if (!groups[dateStr]) {
        groups[dateStr] = {
          dateStr,
          label: dateStr !== "N/A" 
            ? new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
            : "No Date",
          txns: [],
          totalSales: 0,
          totalPurchases: 0
        };
      }
      const grp = groups[dateStr];
      grp.txns.push(txn);
      if (txn.txnType === "sale") {
        grp.totalSales += parseFloat(txn.grandTotal) || 0;
      } else {
        grp.totalPurchases += parseFloat(txn.grandTotal) || 0;
      }
    });

    const list = Object.values(groups).sort((a, b) => b.dateStr.localeCompare(a.dateStr));

    // Initialize first few dates as expanded by default
    if (Object.keys(expandedDates).length === 0 && list.length > 0) {
      const initialExpanded = {};
      list.slice(0, 3).forEach((item) => {
        initialExpanded[item.dateStr] = true;
      });
      setExpandedDates(initialExpanded);
    }

    return list;
  }, [sales, purchases]);

  const toggleDate = (dateStr) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Receipt className="size-5 text-violet-600" /> Day-Wise Transaction Ledger
        </h3>
      </div>

      <div className="space-y-4">
        {groupedTimeline.length > 0 ? (
          groupedTimeline.map((group) => {
            const isExpanded = !!expandedDates[group.dateStr];
            return (
              <div 
                key={group.dateStr} 
                className="border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white"
              >
                {/* Accordion Group Header */}
                <div 
                  onClick={() => toggleDate(group.dateStr)}
                  className="bg-gray-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-gray-900 text-sm">{group.label}</span>
                    <span className="text-xs text-gray-400 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      {group.txns.length} transaction{group.txns.length !== 1 && "s"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {group.totalSales > 0 && (
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <ArrowUpRight className="size-3.5" /> Inflow: + ₹{group.totalSales.toFixed(2)}
                      </span>
                    )}
                    {group.totalPurchases > 0 && (
                      <span className="text-violet-600 flex items-center gap-0.5">
                        <ArrowDownLeft className="size-3.5" /> Outflow: - ₹{group.totalPurchases.toFixed(2)}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="size-4 text-gray-400" /> : <ChevronDown className="size-4 text-gray-400" />}
                  </div>
                </div>

                {/* Accordion Content Table */}
                {isExpanded && (
                  <div className="border-t border-gray-200 overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50/25 border-b border-gray-200 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                          <th className="px-4 py-2">Invoice / Ref No</th>
                          <th className="px-3 py-2">Type</th>
                          <th className="px-3 py-2">Party Name</th>
                          <th className="px-3 py-2 text-center">Payment Mode</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-center">Status</th>
                          <th className="px-3 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.txns.map((txn, idx) => (
                          <tr key={txn._id || idx} className="hover:bg-gray-50/25 transition-colors">
                            <td className="px-4 py-2.5 font-semibold text-gray-900">
                              {txn.invoiceNo}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${
                                txn.txnType === "sale"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-violet-50 text-violet-700 border-violet-100"
                              }`}>
                                {txn.txnType === "sale" ? "Sale Invoice" : "Purchase Bill"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-medium text-gray-700">{txn.partyName}</td>
                            <td className="px-3 py-2.5 text-center text-xs font-semibold text-gray-500">
                              {txn.paymentMode || "Cash"}
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold text-gray-900">
                              ₹{(parseFloat(txn.grandTotal) || 0).toFixed(2)}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                txn.isPaid
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}>
                                {txn.isPaid ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                onClick={() => navigate(`/app/sale/invoiceview/${txn._id}`)}
                                className="p-1 hover:bg-gray-100 rounded text-violet-600 transition-colors cursor-pointer"
                                title="View Document"
                              >
                                <Eye className="size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm bg-gray-50/50 rounded-2xl border border-dashed border-gray-300">
            No transactions found for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportLedger;
