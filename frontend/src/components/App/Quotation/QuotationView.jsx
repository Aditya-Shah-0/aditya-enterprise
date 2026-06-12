import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, ScrollText, Share2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { quotationService } from "../../../services/quotationService";
import { amountToWords } from "../../../utils/amountToWords";
import toast, { Toaster } from "react-hot-toast";
import { ShareModal } from "../Common/ShareModal";

const QuotationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { owner } = useAuth();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const businessSettings = owner?.businessSettings;
  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const res = await quotationService.getQuotations();
        const found = res.quotations?.find((q) => q._id === id);
        if (found) {
          setQuote(found);
        } else {
          toast.error("Quotation not found");
          navigate("/app/quotation");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load quotation details");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [id, navigate]);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = quote?.quotationNo || "Quotation";
    window.print();
    document.title = originalTitle;
  };

  const handleConvertToInvoice = () => {
    if (!quote) return;
    sessionStorage.setItem("convert_quotation", JSON.stringify(quote));
    toast.success("Loaded quote details! Opening invoice form...");
    setTimeout(() => {
      navigate("/app/sale/addsale");
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-sm font-semibold text-gray-500">Loading estimation details...</span>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 rounded-xl flex flex-col items-center">
      <Toaster position="top-center" />

      {/* TOP CONTROL PANEL (HIDDEN ON PRINT) */}
      <div className="w-full max-w-[210mm] bg-white p-4 rounded-xl border border-gray-250 mb-6 flex justify-between items-center shadow-sm print:hidden">
        <button
          onClick={() => navigate("/app/quotation")}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to List
        </button>

        <div className="flex gap-3">
          {quote.status !== "Invoiced" && (
            <button
              onClick={handleConvertToInvoice}
              className="flex items-center gap-2 bg-purple-650 hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <ScrollText size={16} /> Convert to Invoice
            </button>
          )}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Share2 size={16} /> Share WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Printer size={16} /> Print/PDF
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
                    @media print {
                        body * {
                            visibility: hidden !important;
                        }
                        .print-invoice-area, .print-invoice-area * {
                            visibility: visible !important;
                        }
                        .print-invoice-area {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 210mm !important;
                            height: 297mm !important;
                            margin: 0 !important;
                            padding: 10mm !important;
                            transform: none !important;
                            box-shadow: none !important;
                            box-sizing: border-box !important;
                        }
                        .print-invoice-area * {
                            box-sizing: border-box !important;
                        }
                        .print-invoice-area > div {
                            box-shadow: none !important;
                            margin: 0 !important;
                        }
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        html, body {
                            width: 210mm !important;
                            height: 297mm !important;
                            background: white !important;
                        }
                    }
                ` }} />

      {/* ESTIMATION PRINT DOCUMENT (A4 DIMENSIONS) */}
      <div
        className="bg-white shadow-2xl p-[10mm] font-serif text-gray-900 border-2 border-gray-800 flex flex-col print:shadow-none print:border-0 print-invoice-area"
        style={{
          width: "210mm",
          minHeight: "297mm",
        }}
      >
        {/* INNER DOCUMENT BOX */}
        <div className="border border-gray-800 flex-1 flex flex-col">
          {/* HEADER BAR */}
          <div className="flex justify-between items-center bg-gray-50 border-b border-gray-800 px-4 py-1.5 text-xs text-black">
            <span>All India Delivery Avail.</span>
            <span className="font-bold underline uppercase tracking-wider text-sm border-2 border-black px-2 bg-white">
              Estimation / Quotation
            </span>
            <span>Tel: {businessSettings?.companyPhone || "-------------"}</span>
          </div>

          {/* BUSINESS META IN DETAILS */}
          <div className="py-4 px-4 flex items-center justify-center relative min-h-[112px] border-b border-gray-800">
            {businessSettings?.logo && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                <img
                  src={`${BASE_URL}${businessSettings.logo}`}
                  alt="Logo"
                  className="max-w-[120px] max-h-16 object-contain"
                />
              </div>
            )}
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 uppercase mb-1">
                {businessSettings?.businessName || "Your Business Name"}
              </h1>
              <p className="text-gray-600 text-xs font-medium uppercase leading-relaxed">
                {businessSettings?.billingAddress || "Your Business Address"},{" "}
                {businessSettings?.city || ""} - {businessSettings?.pincode || ""}
              </p>
              <div className="flex items-center gap-x-4 mt-0.5">
                {businessSettings?.companyEmail && (
                  <span className="text-xs text-blue-600 underline">
                    {businessSettings.companyEmail}
                  </span>
                )}
                {businessSettings?.gstNumber && (
                  <span className="text-xs font-bold text-gray-700">
                    GSTIN: {businessSettings.gstNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CLIENT & ESTIMATE METADATA */}
          <div className="flex border-b border-gray-800 text-sm">
            <div className="flex-1 p-3 border-r border-gray-800 space-y-2">
              <div className="flex">
                <span className="w-16 text-gray-500 font-bold">M/s.:</span>
                <span className="font-bold uppercase border-b border-dotted border-gray-400 flex-1">
                  {quote.partyName}
                </span>
              </div>
              <div className="flex">
                <span className="w-16 text-gray-500 font-bold">Address:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {quote.partyAddress || "----------------"}
                </span>
              </div>
              <div className="flex text-xs">
                <span className="w-16 text-gray-500 font-bold">State:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {quote.stateOfSupply || "----------------"}
                </span>
              </div>
            </div>
            <div className="w-72 p-3 space-y-2 text-xs">
              <div className="flex">
                <span className="w-28 text-gray-500 font-bold">Quotation No:</span>
                <span className="font-bold text-gray-900">{quote.quotationNo}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-gray-500 font-bold">Quote Date:</span>
                <span className="font-bold">{quote.date ? quote.date.split("T")[0] : ""}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-gray-500 font-bold">Valid Until:</span>
                <span className="font-bold text-red-600">
                  {quote.dueDate ? quote.dueDate.split("T")[0] : ""}
                </span>
              </div>
            </div>
          </div>

          {/* PARTICULARS GRID */}
          <div className="border-b border-gray-800 flex-1 flex flex-col">
            <div className="flex bg-gray-100 border-b border-gray-800 font-bold text-center text-xs uppercase">
              <div className="w-12 border-r border-gray-800 py-2">Sl.No.</div>
              <div className="flex-1 border-r border-gray-800 py-2">Particulars / Description</div>
              <div className="w-20 border-r border-gray-800 py-2">Qty.</div>
              <div className="w-24 border-r border-gray-800 py-2">Rate (₹)</div>
              <div className="w-32 py-2">Amount (₹)</div>
            </div>

            {quote.particulars.map((item, index) => (
              <div key={index} className="flex text-sm border-b border-gray-200 min-h-10 items-center">
                <div className="w-12 border-r border-gray-800 py-1.5 text-center">{index + 1}</div>
                <div className="flex-1 border-r border-gray-800 p-2 text-left">
                  <p className="font-bold uppercase text-gray-900 leading-tight">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 italic mt-0.5">{item.description}</p>
                  )}
                </div>
                <div className="w-20 border-r border-gray-800 py-1.5 text-center font-bold">
                  {item.qty}
                </div>
                <div className="w-24 border-r border-gray-800 p-2 text-right font-medium">
                  {item.price.toFixed(2)}
                </div>
                <div className="w-32 p-2 text-right font-bold text-gray-900">
                  {(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}

            {/* FILLER FOR EMPTY PAGE HEIGHT */}
            <div className="flex-1 flex min-h-24">
              <div className="w-12 border-r border-gray-800"></div>
              <div className="flex-1 border-r border-gray-800"></div>
              <div className="w-20 border-r border-gray-800"></div>
              <div className="w-24 border-r border-gray-800"></div>
              <div className="w-32"></div>
            </div>
          </div>

          {/* TOTALS & TAX CALCULATIONS */}
          <div className="flex border-b border-gray-800">
            {/* Amount in words */}
            <div className="flex-1 p-3 border-r border-gray-800 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                Estimated Total (in words):
              </span>
              <p className="text-xs font-extrabold italic text-gray-850 leading-relaxed">
                {amountToWords(quote.grandTotal)} Only
              </p>
              {quote.customFooterText && (
                <div className="mt-4 text-[10px] text-gray-500 leading-relaxed">
                  <p className="font-bold underline text-gray-700">Notes & T&C:</p>
                  <p className="italic">{quote.customFooterText}</p>
                </div>
              )}
            </div>

            {/* Calculation Numbers */}
            <div className="w-72 text-xs font-semibold">
              <div className="flex justify-between p-2.5 border-b border-gray-200">
                <span>Subtotal:</span>
                <span className="text-gray-900 font-bold">₹ {quote.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2.5 border-b border-gray-200">
                <span>Discount ({quote.discountPercentage}%):</span>
                <span>- ₹ {((quote.subTotal * quote.discountPercentage) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2.5 border-b border-gray-200">
                <span>GST ({quote.taxPercentage}%):</span>
                <span>+ ₹ {((quote.subTotal * quote.taxPercentage) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-150 text-sm font-extrabold border-t border-gray-800">
                <span>Grand Total:</span>
                <span className="text-blue-700">
                  ₹ {quote.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* SIGNATURE AREA */}
          <div className="flex justify-between items-end p-4 bg-gray-50/50 text-[10px] text-gray-500 leading-tight">
            <div>
              <p className="font-bold">Important Notice:</p>
              <p>1. This is a rough estimation of items and rates before actual order placing.</p>
              <p>2. Final invoicing will account for stock availability and real-time taxes.</p>
            </div>
            <div className="text-center w-48 flex flex-col items-center">
              <p className="mb-2 font-bold text-gray-900">For {businessSettings?.businessName || "Your Company"}</p>
              {businessSettings?.signature && (
                <div className="h-10 w-28 flex items-center justify-center overflow-hidden mb-1">
                  <img
                    src={`${BASE_URL}${businessSettings.signature}`}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <p className="border-t border-gray-400 pt-1 w-full text-center">Prepared By</p>
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        docType="Quotation"
        docNo={quote.quotationNo}
        partyName={quote.partyName}
        grandTotal={quote.grandTotal}
        date={quote.date}
        initialPhone={quote.partyPhone}
      />
    </div>
  );
};

export default QuotationView;
