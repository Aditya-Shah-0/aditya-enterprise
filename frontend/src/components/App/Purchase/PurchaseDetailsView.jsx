import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit3, Printer, Banknote, Calendar, MapPin, 
  Phone, User, ShieldCheck, Tag, ShoppingBag, FileText, Share2
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { amountToWords } from "../../../utils/amountToWords";
import { ShareModal } from "../Common/ShareModal";
import PaymentModal from "../Common/PaymentModal";
import { toast } from "react-hot-toast";
import { purchaseService } from "../../../services/purchaseService";

export const PurchaseDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { purchases, refreshPurchases } = useAuth();
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const purchase = purchases?.purchases?.find((item) => item._id === id);

  if (!purchase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <LoaderComponent />
      </div>
    );
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 text-black">
      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:text-black cursor-pointer shadow-xs transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Purchase Bill: {purchase.invoiceNo}</h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                purchase.isPaid 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                <span className={`size-1.5 rounded-full ${purchase.isPaid ? "bg-emerald-500" : "bg-red-500"}`} />
                {purchase.isPaid ? "Paid" : "Unpaid / Outstanding"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Logged on {purchase.date ? purchase.date.split("T")[0] : ""}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {!purchase.isPaid && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Banknote size={16} /> Record Outflow Payment
            </button>
          )}

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 border border-emerald-200 rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Share2 size={16} /> Share WhatsApp
          </button>

          <button
            onClick={() => navigate(`/app/sale/invoiceview/${purchase._id}`)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 border border-gray-255 rounded-lg text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Printer size={16} /> Print View
          </button>

          <button
            onClick={() => navigate(`/app/purchase/edit/${purchase._id}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Edit3 size={16} /> Edit Purchase Bill
          </button>
        </div>
      </div>

      {/* Main Grid Panels */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Details and Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Party and supply details */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <User size={16} className="text-gray-400" /> Vendor Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-gray-900 text-base">{purchase.partyName}</p>
                
                {purchase.partyPhone && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span>{purchase.partyPhone}</span>
                    <button 
                      onClick={() => handleCopy(purchase.partyPhone, "Phone")}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Copy
                    </button>
                  </p>
                )}

                {purchase.partyAddress && (
                  <p className="text-gray-600 flex items-start gap-2 leading-relaxed">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{purchase.partyAddress}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <FileText size={16} className="text-gray-400" /> Bill Details
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-medium">Due Date:</span>
                  <span className="font-semibold text-red-600 flex items-center gap-1">
                    <Calendar size={13} /> {purchase.dueDate ? purchase.dueDate.split("T")[0] : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Initial Mode:</span>
                  <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{purchase.paymentMode || "Cash"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items particulars table */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-gray-400" /> Traded Items Particulars
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-xs tracking-wider uppercase">
                    <th className="px-3 py-2.5">Sl</th>
                    <th className="px-3 py-2.5">Particulars Name / Description</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Unit Rate (₹)</th>
                    <th className="px-3 py-2.5 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {purchase.particulars && purchase.particulars.length > 0 ? (
                    purchase.particulars.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-3 py-3 text-gray-400 font-normal">{idx + 1}</td>
                        <td className="px-3 py-3">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 italic font-normal mt-0.5">{item.description}</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-800 font-bold">{item.qty}</td>
                        <td className="px-3 py-3 text-right text-gray-700 font-normal">{(item.price || 0).toFixed(2)}</td>
                        <td className="px-3 py-3 text-right text-gray-900 font-bold">{(item.amount || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-6 text-center text-gray-400">
                        No particulars listed on this purchase bill.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Totals summary and timeline */}
        <div className="space-y-6">
          
          {/* Arithmetical Totals Box */}
          <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-xs text-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Tag size={16} className="text-gray-400" /> Calculations Summary
            </h3>
            
            <div className="space-y-2.5 border-b border-gray-100 pb-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">₹ {(purchase.subTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount ({purchase.discountPercentage || 0}%):</span>
                <span className="font-semibold text-gray-900">
                  - ₹ {(((purchase.subTotal || 0) * (purchase.discountPercentage || 0)) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({purchase.taxPercentage || 0}%):</span>
                <span className="font-semibold text-gray-900">
                  + ₹ {(((purchase.subTotal || 0) * (purchase.taxPercentage || 0)) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 py-3 border-b border-gray-100 text-base font-bold">
              <div className="flex justify-between text-gray-900">
                <span>Grand Total:</span>
                <span className="text-blue-650">₹ {(purchase.grandTotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm font-medium">
                <span>Paid Amount:</span>
                <span className="text-emerald-600 font-bold">₹ {(purchase.paidAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 font-extrabold text-lg">
              <span className="text-gray-750">Balance Due:</span>
              <span className={purchase.balance > 0 ? "text-red-600" : "text-emerald-600"}>
                ₹ {(purchase.balance || 0).toFixed(2)}
              </span>
            </div>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-[11px] leading-relaxed text-gray-500 italic">
              <span className="font-bold uppercase not-italic block text-gray-400 mb-0.5">Amount in words:</span>
              {amountToWords(purchase.grandTotal)} Only
            </div>
          </div>

          {/* Chronological installment history ledger */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" /> Payments Audit Timeline
            </h3>

            {purchase.payments && purchase.payments.length > 0 ? (
              <div className="relative border-l border-gray-200 ml-2.5 space-y-4">
                {purchase.payments.map((payment, idx) => (
                  <div key={payment._id || idx} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 size-3 bg-emerald-500 rounded-full border-2 border-white" />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-900">₹ {(payment.amount || 0).toFixed(2)}</span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {payment.paymentMode}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {payment.date 
                          ? new Date(payment.date).toLocaleDateString("en-US", { 
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit' 
                            }) 
                          : "N/A"
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4 italic">No payments logged yet.</p>
            )}
          </div>

        </div>

      </div>

      {/* Share via WhatsApp Modal popup */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        docType="Purchase Bill"
        docNo={purchase.invoiceNo}
        partyName={purchase.partyName}
        grandTotal={purchase.grandTotal}
        date={purchase.date}
        initialPhone={purchase.partyPhone}
      />

      {/* Payment installment recorder modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            refreshPurchases();
          }}
          title="Record Outward Payment"
          onSave={async (data) => {
            await purchaseService.updatePurchase(purchase._id, data);
            await refreshPurchases();
            toast.success("Payment recorded successfully!");
          }}
          docNo={purchase.invoiceNo}
          partyName={purchase.partyName}
          totalAmount={purchase.grandTotal}
          paidAmount={purchase.paidAmount}
          currentBalance={purchase.balance}
        />
      )}
    </div>
  );
};

const LoaderComponent = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-sm font-semibold">Loading Purchase details...</span>
  </div>
);

export default PurchaseDetailsView;
