import React from "react";
import { ShoppingCart, Banknote, FileText } from "lucide-react";
import { StatCard } from "../Dashboard/StatCard";

const StatsCards = ({ stats }) => {
  const totalPurchases = stats?.totalPurchases || 0;
  const totalPaid = stats?.totalPaid || 0;
  const totalPending = stats?.totalPending || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Outflow"
        icon={<ShoppingCart className="size-8 text-violet-600" />}
        value={"₹ " + totalPurchases.toFixed(2)}
      />
      <StatCard
        title="Paid Amount"
        icon={<Banknote className="size-8 text-green-600" />}
        value={"₹ " + totalPaid.toFixed(2)}
      />
      <StatCard
        title="Balance Due"
        icon={<FileText className="size-8 text-red-600" />}
        value={"₹ " + totalPending.toFixed(2)}
      />
    </div>
  );
};

export default StatsCards;
