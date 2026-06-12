import React, { useState, useEffect } from "react";
import { X, Banknote, HelpCircle } from "lucide-react";

export const PaymentModal = ({ isOpen, onClose, onSave, title, docNo, partyName, totalAmount, paidAmount, currentBalance }) => {
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Default to remaining balance
      setAmountToPay(currentBalance.toFixed(2));
      setPaymentMode("Cash");
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setError("");
      setLoading(false);
    }
  }, [isOpen, currentBalance]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const value = parseFloat(amountToPay);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid payment amount greater than zero.");
      return;
    }

    if (value > parseFloat(currentBalance.toFixed(2))) {
      setError(`Payment amount cannot exceed the pending balance of ₹${currentBalance.toFixed(2)}.`);
      return;
    }

    setLoading(true);
    try {
      await onSave({ amount: value, paymentMode, date: paymentDate });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-750">
          <div className="flex items-center gap-2.5">
            <div className="bg-violet-100 dark:bg-violet-900/50 p-2 rounded-lg text-violet-600 dark:text-violet-400">
              <Banknote size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title || "Record Payment"}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Cards */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-2 text-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Invoice/Bill No:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{docNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Party / Partner:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{partyName}</span>
            </div>
            <hr className="border-gray-100 dark:border-gray-800 my-1" />
            <div className="flex justify-between text-xs pt-1">
              <span className="text-gray-400">Total Amount:</span>
              <span className="font-semibold text-gray-500 dark:text-gray-400">₹ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Amount Paid So Far:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹ {paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 dark:text-white pt-1">
              <span>Remaining Balance Due:</span>
              <span className="text-red-600 dark:text-red-400 font-bold">₹ {currentBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Amount Paid Field */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Amount Paid Now (₹)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              max={currentBalance}
              required
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base font-bold"
              placeholder="0.00"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Payment Date
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium border border-red-100 dark:border-red-950 flex items-start gap-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-violet-100 dark:shadow-none transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Record Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
