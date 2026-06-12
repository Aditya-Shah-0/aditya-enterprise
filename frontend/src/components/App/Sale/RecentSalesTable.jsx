import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BanknoteArrowUp, Eye, ScrollText, Printer } from "lucide-react";

const RecentSalesTable = ({
  filteredTransactions,
  searchQuery,
  setSearchQuery,
  onRecordPayment,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-6 py-4 text-black bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by party, invoice, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 placeholder-gray-400 transition-all"
          />
        </div>
        <button
          onClick={() => navigate("/app/sale/addsale")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="size-4" /> Add Sale
        </button>
      </div>

      {/* All Transactions */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/75 uppercase text-[10px] tracking-wider font-semibold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Invoice No</th>
                <th className="px-4 py-3 text-left">Party Name</th>
                <th className="px-4 py-3 text-left">Total Amount</th>
                <th className="px-4 py-3 text-left">Balance</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            {filteredTransactions?.length > 0 ? (
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction, index) => {
                  const balance = transaction.grandTotal - transaction.paidAmount;
                  return (
                    <tr
                      key={transaction._id || index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-gray-700 font-medium">
                        {transaction.date ? transaction.date.split("T")[0] : ""}
                      </td>
                      <td className="px-4 py-3.5 text-gray-900 font-semibold">{transaction.invoiceNo}</td>
                      <td className="px-4 py-3.5 text-gray-900 font-bold">{transaction.partyName}</td>
                      <td className="px-4 py-3.5 text-gray-900 font-bold">
                        ₹ {(transaction.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-semibold">
                        ₹ {balance.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            transaction.isPaid
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${transaction.isPaid ? "bg-green-500" : "bg-red-500"}`} />
                          {transaction.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => onRecordPayment(transaction)}
                            disabled={transaction.isPaid}
                            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:text-gray-400 cursor-pointer"
                            title="Record Payment"
                          >
                            <BanknoteArrowUp className="size-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/sale/view/${transaction._id}`)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="size-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/sale/invoiceview/${transaction._id}`)}
                            className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Print/A4 Invoice View"
                          >
                            <Printer className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-10 text-center w-full">
                      <div className="bg-gray-100 p-2 rounded-full mb-3">
                        <ScrollText className="size-24 text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700">No transactions made yet!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Create your first transaction to start seeing your data
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default RecentSalesTable;
