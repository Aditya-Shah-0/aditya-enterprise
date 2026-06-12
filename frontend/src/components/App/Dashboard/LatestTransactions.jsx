import React from "react";
import { ScrollText } from "lucide-react";

const LatestTransactions = ({ latestTransactions = [] }) => {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-black dark:text-white mb-4">Latest Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-700 uppercase text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Txn No</th>
              <th className="px-4 py-3">Party Name</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {latestTransactions.map((t, idx) => (
              <tr
                key={t._id || idx}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {t.date ? t.date.split("T")[0] : ""}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      t.type === "purchase"
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {t.type === "purchase" ? "Purchase" : "Sale"}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  {t.invoiceNo}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                  {t.partyName}
                </td>
                <td
                  className={`px-4 py-3 font-bold ${
                    t.type === "purchase" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {t.type === "purchase" ? "-" : "+"} ₹{(t.grandTotal || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {latestTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-3">
              <ScrollText className="size-10 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No transactions made yet!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create your first transaction to start seeing your data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestTransactions;
