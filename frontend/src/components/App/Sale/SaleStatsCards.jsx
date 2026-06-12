import React from "react";
import { StatCard } from "../Dashboard/StatCard";
import { BanknoteArrowDown, BanknoteArrowUp, Wallet } from "lucide-react";

const SaleStatsCards = ({ totalPaid = 0, totalUnpaid = 0, totalSales = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Total Paid"
        icon={<BanknoteArrowUp className="size-12 text-green-600" />}
        value={"₹ " + totalPaid}
      />
      <StatCard
        title="Total Unpaid"
        icon={<BanknoteArrowDown className="size-12 text-red-600" />}
        value={"₹ " + totalUnpaid}
      />
      <StatCard
        title="Total Sales"
        icon={<Wallet className="size-12 text-blue-600" />}
        value={"₹ " + totalSales}
      />
    </div>
  );
};

export default SaleStatsCards;
