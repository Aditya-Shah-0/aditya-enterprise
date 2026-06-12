import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";

const ItemDetailsHeader = ({ item, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate("/app/items")}
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        title="Back to Stock"
      >
        <ArrowLeft className="size-5 text-gray-700 dark:text-gray-300" />
      </button>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {item.name}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              item.status === "In Stock"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : item.status === "Low Stock"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {item.status}
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Category: {item.category} | HSN: {item.hsnCode || "N/A"}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
      >
        <Edit className="size-4" />
        Edit Item
      </button>
    </div>
  );
};

export default ItemDetailsHeader;
