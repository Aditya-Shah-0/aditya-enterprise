import React from "react";

export const PartyMetricCard = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${iconBg} p-2.5 rounded-lg border`}>
        {icon}
      </div>
    </div>
  );
};

export default PartyMetricCard;
