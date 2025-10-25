import React from "react";

export const StatCard = ({ title, value, icon }) => (
    <div className={`bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-green-400/30 border-l-4 border-green-500 flex items-center space-x-4`}>
        <div className="flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-black dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        </div>
    </div>
);
