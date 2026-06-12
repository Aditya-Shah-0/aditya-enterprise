import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import InvoicePreview1 from "../Settings/InvoiceSetting/InvoicePreview1";
import InvoicePreview2 from "../Settings/InvoiceSetting/InvoicePreview2";
import InvoicePreview3 from "../Settings/InvoiceSetting/InvoicePreview3";
import InvoicePreview4 from "../Settings/InvoiceSetting/InvoicePreview4";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { ShareModal } from "../Common/ShareModal";

const InvoiceView = () => {
    const { id } = useParams();
    const { transaction, purchases, owner } = useAuth();
    const navigate = useNavigate();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const rawData = transaction?.transactions?.find((item) => item._id === id) || 
                    purchases?.purchases?.find((item) => item._id === id);

    // Map grandTotal to total for rendering compatibility with preview templates
    const data = rawData ? {
        ...rawData,
        total: rawData.total || rawData.grandTotal || 0
    } : null;

    const isPurchase = rawData?.type === 'purchase' || purchases?.purchases?.some(p => p._id === id);

    const invoicePreference = owner?.invoicePreference || {
        templateId: 'standard',
        themeColor: '#4F46E5',
        showLogo: true,
        showBusinessName: true,
        showCompanyAddress: true,
        showItemDescription: true,
        showSignature: true,
        customFooterText: 'Thank you for your business!'
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = data?.invoiceNo || "Invoice";
        window.print();
        document.title = originalTitle;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                {/* Header row aligned to scaled invoice width */}
                <div className="w-[178.5mm] max-w-full flex justify-between items-center mb-6 print:hidden">
                    <button
                        onClick={() => navigate(isPurchase ? "/app/purchase" : "/app/sale")}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow hover:bg-red-400"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Back</span>
                    </button>

                    <div className="flex gap-3">
                        {data && (
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                            >
                                <Share2 className="size-4" />
                                <span>Share WhatsApp</span>
                            </button>
                        )}
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                            <Printer className="size-4" />
                            <span>Print</span>
                        </button>
                    </div>
                </div>

                {/* Print styling overrides */}
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
                            padding: 0 !important;
                            transform: none !important;
                            box-shadow: none !important;
                        }
                        .print-invoice-area > div {
                            box-shadow: none !important;
                            border: none !important;
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

                {/*Invoice Preview */}
                <div className="scale-[0.85] origin-top shadow-stone-500 print-invoice-area">
                    {invoicePreference.templateId === 'standard' && <InvoicePreview1 settings={invoicePreference} data={data} />}
                    {invoicePreference.templateId === 'table' && <InvoicePreview2 settings={invoicePreference} data={data} />}
                    {invoicePreference.templateId === 'bold' && <InvoicePreview3 settings={invoicePreference} data={data} />}
                    {invoicePreference.templateId === 'rounded' && <InvoicePreview4 settings={invoicePreference} data={data} />}
                </div>

                {/* Payment History Timeline (Non-Printable) */}
                {rawData?.payments && rawData.payments.length > 0 && (
                    <div className="w-[178.5mm] max-w-full bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mt-8 print:hidden text-black dark:text-white">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="size-2 bg-emerald-500 rounded-full animate-ping" />
                            Payment History Timeline
                        </h3>
                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-4">
                            {rawData.payments.map((payment, idx) => (
                                <div key={payment._id || idx} className="relative pl-6">
                                    <div className="absolute -left-1.5 top-1.5 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-850" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800 dark:text-gray-200">
                                                ₹ {(payment.amount || 0).toFixed(2)}
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {payment.paymentMode}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                            {payment.date ? new Date(payment.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {data && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    docType={isPurchase ? "Purchase Bill" : "Sale Invoice"}
                    docNo={data.invoiceNo}
                    partyName={data.partyName}
                    grandTotal={data.total}
                    date={data.date}
                    initialPhone={data.partyPhone}
                />
            )}
        </div>
    )
}

export default InvoiceView