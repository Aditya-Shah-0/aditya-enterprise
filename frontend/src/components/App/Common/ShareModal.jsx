import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";

export const ShareModal = ({ isOpen, onClose, docType, docNo, partyName, grandTotal, date, initialPhone }) => {
  const [countryCode, setCountryCode] = useState("91");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (initialPhone) {
      // Strip country code if it already starts with + or 91
      let cleanPhone = initialPhone.replace(/\D/g, "");
      if (cleanPhone.startsWith("91") && cleanPhone.length > 10) {
        cleanPhone = cleanPhone.substring(2);
      }
      setPhoneNumber(cleanPhone);
    } else {
      setPhoneNumber("");
    }
  }, [initialPhone, isOpen]);

  if (!isOpen) return null;

  const getShareText = () => {
    const formattedTotal = (grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
    const formattedDate = date ? date.split("T")[0] : "";
    return `Greetings! Here is the details of your ${docType}:

📄 Document: ${docType}
🔢 Reference No: ${docNo}
👤 Client Name: ${partyName}
💰 Total Value: ₹ ${formattedTotal}
📅 Date: ${formattedDate}

You can view or print the details at your convenience. Thank you for doing business with us!`;
  };

  const handleShare = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    const fullNumber = `${countryCode}${cleanPhone}`;
    const text = encodeURIComponent(getShareText());
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${fullNumber}&text=${text}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-200 text-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Share via WhatsApp
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 rounded-lg p-1 hover:bg-gray-150 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Client WhatsApp Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="91">+91 (IN)</option>
                <option value="1">+1 (US)</option>
                <option value="44">+44 (UK)</option>
                <option value="971">+971 (AE)</option>
              </select>
              <input
                type="text"
                maxLength={10}
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-semibold"
              />
            </div>
          </div>

          {/* Preview box */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-[10px]">
              Message Preview
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {getShareText()}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send size={16} /> Share WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
