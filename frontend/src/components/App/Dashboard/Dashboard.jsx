import React, { useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "../Common/ErrorBoundary";
import DashboardStatsCards from "./DashboardStatsCards";
import LatestTransactions from "./LatestTransactions";
import TodoChecklist from "./TodoChecklist";
import SalesPurchaseReport from "./SalesPurchaseReport";
import PendingQuotesWidget from "./PendingQuotesWidget";

const Dashboard = () => {
  const { transaction, purchases } = useAuth();
  const [timeframe, setTimeframe] = useState("Daily");

  // Derive latest transactions
  const latestTransactions = useMemo(() => {
    const txns = transaction?.transactions || [];
    const purchaseTxns = purchases?.purchases || [];

    const mappedTxns = [...txns].map((t) => ({
      ...t,
      type: "sale",
    }));

    const mappedPurchases = [...purchaseTxns].map((p) => ({
      ...p,
      type: "purchase",
    }));

    return [...mappedTxns, ...mappedPurchases]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transaction, purchases]);

  // Derive stats
  const stats = useMemo(() => {
    const txns = transaction?.transactions || [];
    const purchaseTxns = purchases?.purchases || [];

    const totalSales = txns.reduce((sum, t) => sum + (t.grandTotal || 0), 0);
    const totalPurchases = purchaseTxns.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
    const netProfit = totalSales - totalPurchases;

    return { totalSales, totalPurchases, netProfit };
  }, [transaction, purchases]);

  // Derive chart data
  const chartData = useMemo(() => {
    const txns = transaction?.transactions || [];
    const purchaseTxns = purchases?.purchases || [];

    const map = {};

    const getGroupKey = (dateStr) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date)) return "N/A";

      if (timeframe === "Daily") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      if (timeframe === "Weekly") {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        return "W/C " + startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    txns.forEach((t) => {
      const key = getGroupKey(t.date);
      if (key === "N/A") return;
      if (!map[key]) map[key] = { name: key, sales: 0, purchases: 0 };
      map[key].sales += parseFloat(t.grandTotal) || 0;
    });

    purchaseTxns.forEach((p) => {
      const key = getGroupKey(p.date);
      if (key === "N/A") return;
      if (!map[key]) map[key] = { name: key, sales: 0, purchases: 0 };
      map[key].purchases += parseFloat(p.grandTotal) || 0;
    });

    const list = Object.values(map);

    list.sort((a, b) => {
      const cleanA = a.name.replace("W/C ", "");
      const cleanB = b.name.replace("W/C ", "");
      const yearSuffix = timeframe === "Monthly" ? "" : `, ${new Date().getFullYear()}`;
      return new Date(cleanA + yearSuffix) - new Date(cleanB + yearSuffix);
    });

    if (timeframe === "Daily") {
      return list.slice(-7);
    }
    return list;
  }, [transaction, purchases, timeframe]);

  // Derive date range labels
  const dateRangeLabel = useMemo(() => {
    if (chartData.length === 0) return "No transactions";
    if (chartData.length === 1) return chartData[0].name;
    return `${chartData[0].name} to ${chartData[chartData.length - 1].name}`;
  }, [chartData]);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-black">Dashboard</h2>

      <ErrorBoundary title="Stats Cards Error">
        <DashboardStatsCards
          totalSales={stats.totalSales}
          totalPurchases={stats.totalPurchases}
          netProfit={stats.netProfit}
        />
      </ErrorBoundary>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundary title="Latest Ledger Error">
          <LatestTransactions latestTransactions={latestTransactions} />
        </ErrorBoundary>

        <ErrorBoundary title="Todo Checklist Error">
          <TodoChecklist />
        </ErrorBoundary>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary title="Pending Quotations Error">
            <PendingQuotesWidget />
          </ErrorBoundary>
        </div>
      </div>

      <ErrorBoundary title="Sales Purchase Report Chart Error">
        <SalesPurchaseReport
          chartData={chartData}
          dateRangeLabel={dateRangeLabel}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Dashboard;