import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Coins, Percent } from "lucide-react";

export const ReportOverview = ({ sales, purchases }) => {
  const [reportingBasis, setReportingBasis] = useState("Accrual");

  // Aggregate KPI metrics based on selection
  const kpis = useMemo(() => {
    if (reportingBasis === "Accrual") {
      const totalSales = sales.reduce((sum, s) => sum + (parseFloat(s.grandTotal) || 0), 0);
      const totalPurchases = purchases.reduce((sum, p) => sum + (parseFloat(p.grandTotal) || 0), 0);
      const netProfit = totalSales - totalPurchases;
      const margin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
      return { totalSales, totalPurchases, netProfit, margin };
    } else {
      let totalSales = 0;
      sales.forEach((s) => {
        const payments = s.payments || [];
        payments.forEach((p) => {
          totalSales += parseFloat(p.amount) || 0;
        });
      });

      let totalPurchases = 0;
      purchases.forEach((pur) => {
        const payments = pur.payments || [];
        payments.forEach((p) => {
          totalPurchases += parseFloat(p.amount) || 0;
        });
      });

      const netProfit = totalSales - totalPurchases;
      const margin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
      return { totalSales, totalPurchases, netProfit, margin };
    }
  }, [sales, purchases, reportingBasis]);

  // Aggregate monthly/daily data for visual chart
  const chartData = useMemo(() => {
    const dataMap = {};

    const getLabel = (dateStr) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    if (reportingBasis === "Accrual") {
      sales.forEach((s) => {
        const label = getLabel(s.date);
        if (!dataMap[label]) dataMap[label] = { label, Sales: 0, Purchases: 0 };
        dataMap[label].Sales += parseFloat(s.grandTotal) || 0;
      });

      purchases.forEach((p) => {
        const label = getLabel(p.date);
        if (!dataMap[label]) dataMap[label] = { label, Sales: 0, Purchases: 0 };
        dataMap[label].Purchases += parseFloat(p.grandTotal) || 0;
      });
    } else {
      sales.forEach((s) => {
        const payments = s.payments || [];
        payments.forEach((p) => {
          const label = getLabel(p.date);
          if (!dataMap[label]) dataMap[label] = { label, Sales: 0, Purchases: 0 };
          dataMap[label].Sales += parseFloat(p.amount) || 0;
        });
      });

      purchases.forEach((pur) => {
        const payments = pur.payments || [];
        payments.forEach((p) => {
          const label = getLabel(p.date);
          if (!dataMap[label]) dataMap[label] = { label, Sales: 0, Purchases: 0 };
          dataMap[label].Purchases += parseFloat(p.amount) || 0;
        });
      });
    }

    return Object.values(dataMap).sort((a, b) => new Date(a.label) - new Date(b.label));
  }, [sales, purchases, reportingBasis]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Sales */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {reportingBasis === "Accrual" ? "Total Sales Inflow" : "Actual Cash Inflow"}
            </p>
            <p className="text-2xl font-bold text-gray-900">₹{kpis.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 border border-emerald-100">
            <ArrowUpRight className="size-5" />
          </div>
        </div>

        {/* KPI 2: Purchases */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {reportingBasis === "Accrual" ? "Total Purchase Outflow" : "Actual Cash Paid Out"}
            </p>
            <p className="text-2xl font-bold text-gray-900">₹{kpis.totalPurchases.toFixed(2)}</p>
          </div>
          <div className="bg-violet-50 p-2.5 rounded-lg text-violet-600 border border-violet-100">
            <ArrowDownLeft className="size-5" />
          </div>
        </div>

        {/* KPI 3: Net Profit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {reportingBasis === "Accrual" ? "Net Profit / Balance" : "Net Cash Position"}
            </p>
            <p className={`text-2xl font-bold ${kpis.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {kpis.netProfit >= 0 ? "+" : "-"} ₹{Math.abs(kpis.netProfit).toFixed(2)}
            </p>
          </div>
          <div className={`p-2.5 rounded-lg border ${kpis.netProfit >= 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
            <Coins className="size-5" />
          </div>
        </div>

        {/* KPI 4: Margin */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {reportingBasis === "Accrual" ? "Net Profit Margin" : "Cash Margin %"}
            </p>
            <p className={`text-2xl font-bold ${kpis.margin >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {kpis.margin.toFixed(1)}%
            </p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 border border-blue-100">
            <Percent className="size-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="size-5 text-violet-600" /> Revenue & Expense Trends
          </h3>
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-semibold self-start">
            <button
              onClick={() => setReportingBasis("Accrual")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                reportingBasis === "Accrual"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-850 dark:text-gray-400 dark:hover:text-gray-250"
              }`}
            >
              Accrual Basis (Invoice Date)
            </button>
            <button
              onClick={() => setReportingBasis("CashFlow")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                reportingBasis === "CashFlow"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-850 dark:text-gray-400 dark:hover:text-gray-250"
              }`}
            >
              Cash Flow Basis (Payment Date)
            </button>
          </div>
        </div>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="label" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: "0.75rem" }}
                  formatter={(value) => [`₹${parseFloat(value).toFixed(2)}`]}
                />
                <Area type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="Purchases" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPurchases)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No transactions recorded for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportOverview;
