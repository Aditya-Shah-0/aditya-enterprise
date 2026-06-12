import React from "react";
import { Layers, AlertTriangle, XCircle } from "lucide-react";

const StockStats = ({ itemsCount = 0, lowStockCount = 0, outOfStockCount = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Items</h3>
          <Layers className="size-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-black dark:text-white">{itemsCount}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Low Stock Alerts</h3>
          <AlertTriangle className="size-5 text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
          {lowStockCount}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Out of Stock</h3>
          <XCircle className="size-5 text-red-500" />
        </div>
        <p className="text-2xl font-bold text-red-600 dark:text-red-500">
          {outOfStockCount}
        </p>
      </div>
    </div>
  );
};

export default StockStats;
