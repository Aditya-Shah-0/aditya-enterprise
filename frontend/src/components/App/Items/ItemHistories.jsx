import React from "react";
import { ShoppingCart, TrendingUp } from "lucide-react";

const ItemHistories = ({ item, purchaseHistory = [], salesHistory = [] }) => {
  const itemName = item?.name || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Purchase History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
          <ShoppingCart className="size-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Purchase History</h3>
          <span className="ml-auto text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {purchaseHistory.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Vendor</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Qty</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((p, idx) => {
                  const details = p.particulars?.find((x) => x.name === itemName);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {p.date ? new Date(p.date).toLocaleDateString() : ""}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                        {p.partyName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                        +{details?.qty}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        ₹{(details?.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No purchase history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
          <TrendingUp className="size-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Sales History</h3>
          <span className="ml-auto text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {salesHistory.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Qty</th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {salesHistory.length > 0 ? (
                salesHistory.map((s, idx) => {
                  const details = s.particulars?.find((x) => x.name === itemName);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {s.date ? new Date(s.date).toLocaleDateString() : ""}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                        {s.partyName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        -{details?.qty}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        ₹{(details?.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No sales history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemHistories;
