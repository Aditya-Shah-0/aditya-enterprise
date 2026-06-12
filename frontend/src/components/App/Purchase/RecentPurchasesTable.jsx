import React from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Eye, ScrollText, Printer } from "lucide-react";

const RecentPurchasesTable = ({ transactions, onRecordPayment }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Purchases</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50/75 uppercase text-[10px] tracking-wider font-semibold text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Bill No</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          {transactions && transactions.length > 0 ? (
            <tbody className="divide-y divide-gray-100">
              {[...transactions].reverse().map((txn, idx) => (
                <tr key={txn._id || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {txn.date ? txn.date.split("T")[0] : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{txn.invoiceNo}</td>
                  <td className="px-4 py-3 text-gray-900 font-bold">{txn.partyName}</td>
                  <td className="px-4 py-3 text-gray-900 font-bold">₹ {(txn.grandTotal || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        txn.isPaid
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${txn.isPaid ? "bg-green-500" : "bg-red-500"}`} />
                      {txn.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => onRecordPayment(txn)}
                        disabled={txn.isPaid}
                        className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:text-gray-400 cursor-pointer"
                        title="Record Payment"
                      >
                        <Banknote className="size-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/app/purchase/view/${txn._id}`)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/app/sale/invoiceview/${txn._id}`)}
                        className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                        title="Print/A4 Invoice View"
                      >
                        <Printer className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="6">
                  <div className="flex flex-col items-center justify-center py-12 text-center w-full text-gray-400">
                    <ScrollText className="size-16 mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-700">No purchases recorded yet</p>
                    <p className="text-xs mt-1">Record your first purchase using the form on the left</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default RecentPurchasesTable;
