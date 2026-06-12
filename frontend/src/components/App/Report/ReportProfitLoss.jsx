import React, { useState, useMemo } from "react";
import { FileSpreadsheet, Calendar } from "lucide-react";

export const ReportProfitLoss = ({ sales, purchases }) => {
  const [groupBy, setGroupBy] = useState("monthly"); // "daily", "monthly", "yearly"

  // Group sales and purchases by the selected timeframe
  const statementData = useMemo(() => {
    const map = {};

    const getGroupKey = (dateStr) => {
      if (!dateStr) return "N/A";
      const cleaned = dateStr.split("T")[0]; // YYYY-MM-DD
      if (groupBy === "daily") return cleaned;
      if (groupBy === "monthly") return cleaned.substring(0, 7); // YYYY-MM
      return cleaned.substring(0, 4); // YYYY
    };

    const formatGroupLabel = (key) => {
      if (key === "N/A") return "N/A";
      const date = new Date(key + (groupBy === "monthly" ? "-02" : groupBy === "yearly" ? "-02-02" : ""));
      if (groupBy === "daily") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      if (groupBy === "monthly") {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }
      return key; // Year string
    };

    // Process Sales
    sales.forEach((s) => {
      const key = getGroupKey(s.date);
      if (!map[key]) {
        map[key] = {
          key,
          label: formatGroupLabel(key),
          salesCount: 0,
          grossSales: 0,
          discountsAllowed: 0,
          gstCollected: 0,
          purchasesCount: 0,
          grossPurchases: 0,
          discountsReceived: 0,
          gstPaid: 0,
        };
      }
      const record = map[key];
      const sub = parseFloat(s.subTotal) || 0;
      const discountPct = parseFloat(s.discountPercentage) || 0;
      const taxPct = parseFloat(s.taxPercentage) || 0;

      record.salesCount += 1;
      record.grossSales += parseFloat(s.grandTotal) || 0;
      record.discountsAllowed += sub * (discountPct / 100);
      record.gstCollected += sub * (taxPct / 100);
    });

    // Process Purchases
    purchases.forEach((p) => {
      const key = getGroupKey(p.date);
      if (!map[key]) {
        map[key] = {
          key,
          label: formatGroupLabel(key),
          salesCount: 0,
          grossSales: 0,
          discountsAllowed: 0,
          gstCollected: 0,
          purchasesCount: 0,
          grossPurchases: 0,
          discountsReceived: 0,
          gstPaid: 0,
        };
      }
      const record = map[key];
      const sub = parseFloat(p.subTotal) || 0;
      const discountPct = parseFloat(p.discountPercentage) || 0;
      const taxPct = parseFloat(p.taxPercentage) || 0;

      record.purchasesCount += 1;
      record.grossPurchases += parseFloat(p.grandTotal) || 0;
      record.discountsReceived += sub * (discountPct / 100);
      record.gstPaid += sub * (taxPct / 100);
    });

    // Sort periods descending (newest first)
    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [sales, purchases, groupBy]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileSpreadsheet className="size-5 text-violet-600" /> Income Statement / P&L
        </h3>

        {/* Group Selector Toggle Buttons */}
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-sm self-start shrink-0">
          <button
            onClick={() => setGroupBy("daily")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              groupBy === "daily" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setGroupBy("monthly")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              groupBy === "monthly" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setGroupBy("yearly")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              groupBy === "yearly" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
              <th className="px-4 py-3">Time Period</th>
              <th className="px-3 py-3 text-center">Invoices (Sales)</th>
              <th className="px-3 py-3 text-right">Sales Inflow</th>
              <th className="px-3 py-3 text-right">Purchases Outflow</th>
              <th className="px-3 py-3 text-right">Tax collected (Output)</th>
              <th className="px-3 py-3 text-right">Tax paid (Input)</th>
              <th className="px-3 py-3 text-right">Net Profit / Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {statementData.length > 0 ? (
              statementData.map((row) => {
                const profit = row.grossSales - row.grossPurchases;
                const margin = row.grossSales > 0 ? (profit / row.grossSales) * 100 : 0;

                return (
                  <tr key={row.key} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 flex items-center gap-1.5">
                      <Calendar className="size-4 text-gray-400" />
                      {row.label}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-gray-600">
                      {row.salesCount} sale{row.salesCount !== 1 && "s"} | {row.purchasesCount} pur
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-emerald-600">
                      ₹{row.grossSales.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-violet-600">
                      ₹{row.grossPurchases.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-600 font-medium">
                      ₹{row.gstCollected.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-600 font-medium">
                      ₹{row.gstPaid.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex flex-col">
                        <span className={`font-bold ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {profit >= 0 ? "+" : "-"} ₹{Math.abs(profit).toFixed(2)}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {margin.toFixed(1)}% margin
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-gray-400">
                  No transaction records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportProfitLoss;
