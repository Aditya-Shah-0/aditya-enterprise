import React from "react";
import { formatCurrency } from "./utils";
import { PrinterIcon, XCircleIcon } from "./Icons";


export const InvoiceModal = ({ sale, onClose, businessProfile, bankAccounts }) => {
  const handlePrint = () => window.print();
  if (!sale) return null;
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 print:p-0 overflow-y-auto">
      <div className="bg-white text-black rounded-lg p-8 w-full max-w-3xl relative print:shadow-none my-8">
        <div id="invoice-content">
          <header className="flex justify-between items-center mb-8 border-b pb-4 border-gray-300">
            {businessProfile?.logoUrl && <img src={businessProfile.logoUrl} alt="Business Logo" className="h-20 w-auto object-contain" />}
            <div className="text-right">
              <h1 className="text-3xl font-bold text-black">{businessProfile?.businessName || 'XYZ'}</h1>
              <p className="text-sm italic text-gray-600">{businessProfile?.tagline || ''}</p>
              <p className="text-xs text-gray-500">{businessProfile?.gst || ''}</p>
              <p className="text-xs text-gray-500">{businessProfile?.address || ''}</p>
              <p className="text-xs text-gray-500">Ph.No. - {businessProfile?.phone || ''}</p>
            </div>
          </header>
          <div className="flex justify-between mb-6">
            <div>
              <p className="font-bold">Billed To:</p>
              <p>{sale.partyName}</p>
              <p>Ph: {sale.partyPhone}</p>
            </div>
            <div className="text-right">
              <p><span className="font-bold">Invoice No:</span> {sale.id.slice(0, 8).toUpperCase()}</p>
              <p><span className="font-bold">Date:</span> {new Date(sale.date).toLocaleDateString()}</p>
              <p><span className="font-bold">Payment:</span> {sale.paymentMode}</p>
            </div>
          </div>
          <table className="w-full text-left mb-6 text-sm">
            <thead className="bg-gray-200">
              <tr><th className="p-2 w-1/12">No.</th><th className="p-2 w-6/12">Description</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Rate</th><th className="p-2 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td><td className="p-2">{item.productName}</td><td className="p-2 text-right">{item.quantity}</td><td className="p-2 text-right">{formatCurrency(item.price)}</td><td className="p-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right">
            <p className="text-xl font-bold">Grand Total: {formatCurrency(sale.total)}</p>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-start">
            <div>
              <h3 className="font-bold mb-2">Bank Details:</h3>
              {bankAccounts.length > 0 ? bankAccounts.map(acc => (
                <div key={acc.id} className="text-xs mb-2">
                  <p><strong>Bank:</strong> {acc.bankName}, {acc.branch}</p>
                  <p><strong>A/C No:</strong> {acc.accountNumber}</p>
                  <p><strong>IFSC:</strong> {acc.ifscCode}</p>
                </div>
              )): <p className="text-center text-gray-500 dark:text-gray-400 py-4">No bank accounts added.</p>}
            </div>
            {businessProfile?.qrCodeUrl && (
              <div className="text-center">
                <p className="font-bold text-sm">Scan to Pay</p>
                <img src={businessProfile.qrCodeUrl} alt="UPI QR Code" className="h-28 w-28 mx-auto" />
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2 print:hidden">
          <button onClick={handlePrint} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><PrinterIcon className="w-5 h-5" /></button>
          <button onClick={onClose} className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500"><XCircleIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <style>{`@media print { body * { visibility: hidden; } #invoice-content, #invoice-content * { visibility: visible; } #invoice-content { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
    </div>
  );
};