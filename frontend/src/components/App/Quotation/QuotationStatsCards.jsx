import React from "react";
import { StatCard } from "../Dashboard/StatCard";
import { FileText, FileCheck, Landmark } from "lucide-react";

const QuotationStatsCards = ({ totalCount = 0, totalAmount = 0, acceptedAmount = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Total Estimations"
        icon={<FileText className="size-12 text-blue-600" />}
        value={`${totalCount} Quote${totalCount === 1 ? "" : "s"}`}
      />
      <StatCard
        title="Total Quoted Value"
        icon={<Landmark className="size-12 text-indigo-600" />}
        value={"₹ " + totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      />
      <StatCard
        title="Accepted Value"
        icon={<FileCheck className="size-12 text-green-600" />}
        value={"₹ " + acceptedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      />
    </div>
  );
};

export default QuotationStatsCards;
