import React from "react";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const ItemMetricsGrid = ({ item, metrics }) => {
  const currentUnit = item?.unit || "pcs";
  const purchaseRate = item?.purchaseRate || 0;
  const sellingPrice = item?.sellingPrice || 0;

  const totalQuantityPurchased = metrics?.totalQuantityPurchased || 0;
  const totalValuePurchased = metrics?.totalValuePurchased || 0;
  const timesPurchased = metrics?.timesPurchased || 0;

  const totalQuantitySold = metrics?.totalQuantitySold || 0;
  const totalValueSold = metrics?.totalValueSold || 0;
  const timesSold = metrics?.timesSold || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</p>
          <Package className="size-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {item?.quantity || 0}{" "}
          <span className="text-base font-normal text-gray-500">{currentUnit}</span>
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pricing</p>
          <DollarSign className="size-5 text-green-500" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Buy: <span className="font-semibold text-gray-900 dark:text-white">₹{purchaseRate.toFixed(2)}</span>
          </span>
          <span className="text-gray-500">
            Sell: <span className="font-semibold text-gray-900 dark:text-white">₹{sellingPrice.toFixed(2)}</span>
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchased</p>
          <ShoppingCart className="size-5 text-purple-500" />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {totalQuantityPurchased} {currentUnit}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ₹{totalValuePurchased.toFixed(2)} ({timesPurchased} times)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sold</p>
          <TrendingUp className="size-5 text-emerald-500" />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {totalQuantitySold} {currentUnit}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ₹{totalValueSold.toFixed(2)} ({timesSold} times)
        </p>
      </div>
    </div>
  );
};

export default ItemMetricsGrid;
