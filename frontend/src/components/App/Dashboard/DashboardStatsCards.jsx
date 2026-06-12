import React from "react";
import { StatCard } from "./StatCard";
import { BanknoteArrowUp, BanknoteArrowDown, BadgeIndianRupee } from "lucide-react";

const DashboardStatsCards = ({ totalSales = 0, totalPurchases = 0, netProfit = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Sales"
        icon={<BanknoteArrowUp className="size-12 text-green-600" />}
        value={"₹ " + totalSales.toFixed(2)}
      />
      <StatCard
        title="Total Purchases / Expenses"
        icon={<BanknoteArrowDown className="size-12 text-violet-600" />}
        value={"₹ " + totalPurchases.toFixed(2)}
      />
      <StatCard
        title="Net Balance / Profit"
        icon={<BadgeIndianRupee className="size-12 text-blue-600" />}
        value={"₹ " + netProfit.toFixed(2)}
      />
    </div>
  );
};

export default DashboardStatsCards;
