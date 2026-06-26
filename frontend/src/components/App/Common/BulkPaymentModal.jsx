import React, { useState, useEffect } from "react";
import { X, Landmark, Info } from "lucide-react";

export const BulkPaymentModal = ({ isOpen, onClose, onSave, partyName, outstandingBalance, type }) => {
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmountToPay(outstandingBalance > 0 ? outstandingBalance.toFixed(2) : "");
      setPaymentMode("Cash");
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setError("");
      setLoading(false);
    }
  }, [isOpen, outstandingBalance]);

  if (!isOpen) return null;

  const value = parseFloat(amountToPay);
  const surplus = !isNaN(value) && value > outstandingBalance ? value - outstandingBalance : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid payment amount greater than zero.");
      return;
    }

    setLoading(true);
    try {
      await onSave({ amount: value, paymentMode, date: paymentDate, type });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to apply bulk payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-black">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <Landmark size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Record Bulk Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Party / Customer:</span>
              <span className="font-bold text-gray-800">{partyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Payment Context:</span>
              <span className="font-semibold text-gray-700 capitalize">Consolidated Unpaid {type}s</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 pt-1 border-t border-gray-200/50">
              <span>Total Pending Balance:</span>
              <span className="text-red-600 font-bold">₹ {outstandingBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Amount Paid Field */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Amount Received (₹)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-base font-bold"
              placeholder="0.00"
            />
          </div>

          {surplus > 0 && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium border border-emerald-100 flex items-start gap-2">
              <Info className="shrink-0 size-4 mt-0.5 text-emerald-600" />
              <span>
                <strong>Note:</strong> You entered ₹{value.toFixed(2)}, which exceeds the pending balance by <strong>₹{surplus.toFixed(2)}</strong>. This surplus will be saved as an <strong>Advance Credit</strong> for this party.
              </span>
            </div>
          )}

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-sm"
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment Date
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium border border-red-100 flex items-start gap-2">
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
              className="flex-1 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Apply Bulk Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkPaymentModal;
