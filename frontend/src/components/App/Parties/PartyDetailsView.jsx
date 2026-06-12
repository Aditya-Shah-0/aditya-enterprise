import React from "react";
import { 
  MapPin, Copy, ArrowUpRight, ArrowDownLeft, Receipt, Package, Eye, Handshake, Phone
} from "lucide-react";
import PartyMetricCard from "./PartyMetricCard";

export const PartyDetailsView = ({
  activeParty,
  partyItems,
  partyTimeline,
  copyToClipboard,
  navigate
}) => {
  if (!activeParty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
        <Handshake className="size-20 text-gray-300 mb-4" />
        <h4 className="font-bold text-gray-700 text-lg">No Contact Selected</h4>
        <p className="text-sm max-w-sm mt-2 leading-relaxed">
          Choose a customer or supplier from the list on the left to view profile details, outstanding balances, and specific stock trading metrics.
        </p>
      </div>
    );
  }

  const netOutstanding = activeParty.receivable - activeParty.payable;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Profile Header Details card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-24 bg-linear-to-l from-violet-50/50 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{activeParty.name}</h2>
                <div className="flex gap-1.5">
                  {activeParty.isCustomer && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 font-semibold rounded-full border border-emerald-100">Customer</span>
                  )}
                  {activeParty.isSupplier && (
                    <span className="bg-violet-50 text-violet-700 text-xs px-2.5 py-0.5 font-semibold rounded-full border border-violet-100">Supplier</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                <MapPin className="size-4 text-gray-400" /> {activeParty.address}
              </p>
              {activeParty.phone && (
                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                  <Phone className="size-4 text-gray-400" /> {activeParty.phone}
                  <button
                    onClick={() => copyToClipboard(activeParty.phone, "Phone Number")}
                    className="text-violet-600 hover:text-violet-800 p-0.5"
                    title="Copy Phone Number"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </p>
              )}
              {activeParty.gstNumber && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold bg-gray-50 border px-2.5 py-1 rounded-lg w-fit mt-2">
                  <span>GSTIN: {activeParty.gstNumber}</span>
                  <button
                    onClick={() => copyToClipboard(activeParty.gstNumber, "GST Number")}
                    className="text-violet-600 hover:text-violet-800 p-0.5"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PartyMetricCard
            title="Total Sales Inflow"
            value={`₹${activeParty.totalSales.toFixed(2)}`}
            icon={<ArrowUpRight className="size-5" />}
            iconBg="bg-emerald-50 text-emerald-600 border-emerald-100"
          />

          <PartyMetricCard
            title="Total Purchase Outflow"
            value={`₹${activeParty.totalPurchases.toFixed(2)}`}
            icon={<ArrowDownLeft className="size-5" />}
            iconBg="bg-violet-50 text-violet-600 border-violet-100"
          />

          <PartyMetricCard
            title="Outstanding Balance"
            value={
              netOutstanding > 0
                ? `+ ₹${netOutstanding.toFixed(2)}`
                : netOutstanding < 0
                ? `- ₹${Math.abs(netOutstanding).toFixed(2)}`
                : "₹0.00"
            }
            icon={<Receipt className="size-5 text-gray-400" />}
            iconBg={
              netOutstanding > 0
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : netOutstanding < 0
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-gray-50 border-gray-250"
            }
          />
        </div>

        {/* What & How Many Traded items list summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="size-5 text-violet-600" /> Traded Items Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
                  <th className="px-3 py-3">Item Name</th>
                  <th className="px-3 py-3 text-center">Traded Role</th>
                  <th className="px-3 py-3 text-center">Total Quantity</th>
                  <th className="px-3 py-3 text-right">Avg Traded Price</th>
                  <th className="px-3 py-3 text-center">Last Active Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partyItems.length > 0 ? (
                  partyItems.map((item, idx) => {
                    const hasSold = item.qtySold > 0;
                    const hasBought = item.qtyBought > 0;
                    const avgSalesRate = hasSold ? item.salesVal / item.qtySold : 0;
                    const avgPurchRate = hasBought ? item.purchasesVal / item.qtyBought : 0;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-3 py-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col gap-1 items-center">
                            {hasSold && (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Sold</span>
                            )}
                            {hasBought && (
                              <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Bought</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-medium text-gray-700">
                          {hasSold && `${item.qtySold} sold`}
                          {hasSold && hasBought && " | "}
                          {hasBought && `${item.qtyBought} bought`}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-gray-900">
                          {hasSold && <p className="text-emerald-600">₹{avgSalesRate.toFixed(2)} (avg)</p>}
                          {hasBought && <p className="text-violet-600">₹{avgPurchRate.toFixed(2)} (avg)</p>}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-500">
                          {item.lastTraded.toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center text-gray-400">
                      No stock items traded with this contact yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chronological Transaction timeline ledger */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Receipt className="size-5 text-violet-600" /> Transaction Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Bill / Ref No</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partyTimeline.length > 0 ? (
                  partyTimeline.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-3 text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${item.txnType === "sale"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-violet-50 text-violet-700 border-violet-100"
                          }`}>
                          {item.txnType === "sale" ? "Sale Invoice" : "Purchase Bill"}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{item.invoiceNo}</td>
                      <td className="px-3 py-3 text-right font-bold text-gray-900">
                        ₹{(item.grandTotal || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.isPaid
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                          {item.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => navigate(`/app/sale/invoiceview/${item._id}`)}
                          className="p-1 hover:bg-gray-100 rounded text-violet-600 transition-colors cursor-pointer"
                          title="View Invoice Document"
                        >
                          <Eye className="size-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-3 py-8 text-center text-gray-400">
                      No transactions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartyDetailsView;
