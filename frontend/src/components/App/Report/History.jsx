import React, { useState, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, FileSpreadsheet, Receipt, Scale, LineChart, Loader2, Calendar, Filter, X, CheckCircle 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import ReportOverview from "./ReportOverview";
import ReportProfitLoss from "./ReportProfitLoss";
import ReportLedger from "./ReportLedger";
import ReportTaxGST from "./ReportTaxGST";
import ReportInsights from "./ReportInsights";
import ReportPaidUnpaid from "./ReportPaidUnpaid";

const History = () => {
  const navigate = useNavigate();
  const { transaction, purchases } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "profitloss", "ledger", "taxgst", "insights", "paymentstatus"

  // Date Range States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Quick Date Range Filters
  const applyQuickFilter = (type) => {
    const today = new Date();
    let start = new Date();

    if (type === "thisMonth") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (type === "last30") {
      start.setDate(today.getDate() - 30);
    } else if (type === "thisYear") {
      start = new Date(today.getFullYear(), 0, 1);
    } else if (type === "clear") {
      setStartDate("");
      setEndDate("");
      toast.success("Date filters cleared");
      return;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    toast.success(`Date filter applied`);
  };

  // Filter Sales & Purchases by selected date range
  const filteredData = useMemo(() => {
    const rawSales = transaction?.transactions || [];
    const rawPurchases = purchases?.purchases || [];

    const filterTxn = (t) => {
      if (!t.date) return false;
      const txnDate = t.date.split("T")[0];
      if (startDate && txnDate < startDate) return false;
      if (endDate && txnDate > endDate) return false;
      return true;
    };

    return {
      sales: rawSales.filter(filterTxn),
      purchases: rawPurchases.filter(filterTxn)
    };
  }, [transaction, purchases, startDate, endDate]);

  if (!transaction || !purchases) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-white border border-gray-200 rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin size-10 text-violet-600" />
          <p className="text-gray-500 font-semibold">Analyzing company growth files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs min-h-[75vh]">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Overview Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 font-medium">Verify your balance sheets, day-wise ledger, growth charts, and tax collection summaries.</p>
        </div>

        {/* Global Date range filters */}
        <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 border border-gray-250 p-2.5 rounded-xl self-start">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase">
            <Filter className="size-3.5" /> Date Filter:
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Quick presets */}
          <div className="flex gap-1 text-[11px] font-bold">
            <button
              onClick={() => applyQuickFilter("thisMonth")}
              className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              This Month
            </button>
            <button
              onClick={() => applyQuickFilter("last30")}
              className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => applyQuickFilter("thisYear")}
              className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              This Year
            </button>
            {(startDate || endDate) && (
              <button
                onClick={() => applyQuickFilter("clear")}
                className="p-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 cursor-pointer flex items-center justify-center"
                title="Clear Filters"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className="flex border-b border-gray-200 text-sm font-semibold overflow-x-auto gap-4 scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="size-4" /> Overview & Charts
        </button>

        <button
          onClick={() => setActiveTab("profitloss")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "profitloss"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileSpreadsheet className="size-4" /> Profit & Loss
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Receipt className="size-4" /> Day-Wise Ledger
        </button>

        <button
          onClick={() => setActiveTab("taxgst")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "taxgst"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Scale className="size-4" /> Tax & GST Summary
        </button>

        <button
          onClick={() => setActiveTab("insights")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "insights"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <LineChart className="size-4" /> Growth Insights
        </button>

        <button
          onClick={() => setActiveTab("paymentstatus")}
          className={`flex items-center gap-1.5 py-3 border-b-2 px-1 transition-all cursor-pointer ${
            activeTab === "paymentstatus"
              ? "border-violet-600 text-violet-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <CheckCircle className="size-4" /> Payment Statuses
        </button>
      </div>

      {/* Tab Render Views */}
      <div className="flex-1 mt-2">
        {activeTab === "overview" && (
          <ReportOverview 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
          />
        )}
        {activeTab === "profitloss" && (
          <ReportProfitLoss 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
          />
        )}
        {activeTab === "ledger" && (
          <ReportLedger 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
            navigate={navigate}
          />
        )}
        {activeTab === "taxgst" && (
          <ReportTaxGST 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
          />
        )}
        {activeTab === "insights" && (
          <ReportInsights 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
          />
        )}
        {activeTab === "paymentstatus" && (
          <ReportPaidUnpaid 
            sales={filteredData.sales} 
            purchases={filteredData.purchases} 
          />
        )}
      </div>
    </div>
  );
};

export default History;