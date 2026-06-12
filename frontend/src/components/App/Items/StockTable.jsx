import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, Edit, Trash2, Inbox, Loader2 } from "lucide-react";

const StockTable = ({
  filteredItems = [],
  loading = false,
  searchTerm = "",
  setSearchTerm,
  onEditItem,
  onDeleteItem,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items by name or category..."
            className="bg-gray-100 dark:bg-gray-700 border-none text-sm rounded-md pl-10 pr-4 py-2.5 w-full text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Category & HSN</th>
              <th className="px-4 py-3">Stock & Unit</th>
              <th className="px-4 py-3">Pricing (₹)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                  <Loader2 className="animate-spin size-8 mx-auto text-blue-500" />
                </td>
              </tr>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    <div
                      onClick={() => navigate(`/app/items/item/${item._id}`)}
                      className="flex items-center gap-3 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-500 dark:text-gray-400">
                        <Package className="size-4" />
                      </div>
                      {item.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-800 dark:text-gray-200">{item.category}</div>
                    <div className="text-xs text-gray-500">HSN: {item.hsnCode || "N/A"}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">Buy: ₹{(item.purchaseRate || 0).toFixed(2)}</div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-500">
                      Sell: ₹{(item.sellingPrice || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        item.status === "In Stock"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "Low Stock"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item._id)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                  <Inbox className="size-10 mx-auto mb-3 text-gray-400 dark:text-gray-500 opacity-50" />
                  <p className="text-base font-medium">No items found</p>
                  <p className="text-sm mt-1">We couldn't find anything matching "{searchTerm}"</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
