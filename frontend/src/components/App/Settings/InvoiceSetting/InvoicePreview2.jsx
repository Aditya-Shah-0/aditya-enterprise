import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { amountToWords } from '../../../../utils/amountToWords';

const InvoicePreview2 = ({ settings, data }) => {
    const { owner } = useAuth();
    const businessSettings = owner?.businessSettings;

    if (!businessSettings) return null;

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

    // Styles based on theme color
    const borderColor = settings.themeColor;

    return (
        <div
            className="bg-white shadow-2xl mx-auto text-sm text-gray-800 font-serif flex flex-col"
            style={{
                width: '210mm',
                height: '297mm',
                padding: '10mm',
                border: `2px solid ${borderColor}`
            }}
        >
            {/* CONTAINER BORDER */}
            <div className="border border-gray-400 flex-1 flex flex-col">

                {/* HEADER */}
                <div className="border-b border-gray-400 p-4 flex items-center">
                    {settings.showLogo && (
                        <div className="shrink-0 flex items-center justify-center">
                            {businessSettings?.logo ? (
                                <img src={`${BASE_URL}${businessSettings.logo}`} alt="Logo" className="max-w-[120px] max-h-16 object-contain" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                    LOGO
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex-1 text-center">
                        {settings.showBusinessName && (
                            <h1 className="text-2xl font-bold uppercase" style={{ color: borderColor }}>
                                {businessSettings.businessName}
                            </h1>
                        )}
                        {settings.showCompanyAddress && (
                            <p className="text-sm mt-1 whitespace-pre-wrap">
                                {businessSettings.billingAddress} {businessSettings.city}, {businessSettings.state} - {businessSettings.pincode}
                            </p>
                        )}
                        <p className="text-sm">Tel: {businessSettings.companyPhone} | Email: {businessSettings.companyEmail}</p>
                        {businessSettings.gstNumber && <p className="font-bold mt-1">GSTIN: {businessSettings.gstNumber}</p>}
                    </div>
                </div>

                {/* TAX INVOICE LABEL */}
                <div className="border-b border-gray-400 text-center bg-gray-100 py-1 font-bold italic uppercase tracking-wider">
                    Tax Invoice
                </div>

                {/* INVOICE INFO GRID */}
                <div className="flex border-b border-gray-400">
                    {/* LEFT COLUMN */}
                    <div className="w-1/2 border-r border-gray-400 p-2 space-y-1">
                        <div className="flex">
                            <span className="w-32 font-semibold">Invoice No:</span>
                            <span>{data.invoiceNo}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">Invoice Date:</span>
                            <span>{data.date}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">State:</span>
                            <span>{businessSettings.state}</span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-1/2 p-2 space-y-1">
                        <div className="flex">
                            <span className="w-24 font-semibold">Bill To:</span>
                            <span className="font-bold">{data.partyName}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-semibold">Address:</span>
                            <span>{data.partyAddress}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-semibold">GSTIN:</span>
                            <span>{data.gstNumber}</span>
                        </div>
                    </div>
                </div>

                {/* TABLE HEADER */}
                <div className="flex border-b border-gray-400 bg-gray-50 font-bold text-center">
                    <div className="w-12 border-r border-gray-400 p-2">S.No</div>
                    <div className="flex-1 border-r border-gray-400 p-2">Product Description</div>
                    <div className="w-16 border-r border-gray-400 p-2">HSN</div>
                    <div className="w-16 border-r border-gray-400 p-2">Qty</div>
                    <div className="w-24 border-r border-gray-400 p-2">Rate</div>
                    <div className="w-24 p-2">Amount</div>
                </div>

                {/* TABLE BODY */}
                <div className="flex-1 flex flex-col">
                    {data.particulars.map((item, index) => (
                        <div key={index} className="flex border-b border-gray-200">
                            <div className="w-12 border-r border-gray-400 p-2 text-center">{index + 1}</div>
                            <div className="flex-1 border-r border-gray-400 p-2">
                                <p className="font-bold">{item.name}</p>
                                {settings.showItemDescription && <p className="text-xs text-gray-500">{item.description}</p>}
                            </div>
                            <div className="w-16 border-r border-gray-400 p-2 text-center">-</div>
                            <div className="w-16 border-r border-gray-400 p-2 text-center">{item.qty}</div>
                            <div className="w-24 border-r border-gray-400 p-2 text-right">{item.price}</div>
                            <div className="w-24 p-2 text-right font-bold">{(item.qty * item.price)}</div>
                        </div>
                    ))}
                    {/* FILLER SPACE TO KEEP LAYOUT CONSISTENT */}
                    <div className="flex flex-1">
                        <div className="w-12 border-r border-gray-400"></div>
                        <div className="flex-1 border-r border-gray-400"></div>
                        <div className="w-16 border-r border-gray-400"></div>
                        <div className="w-16 border-r border-gray-400"></div>
                        <div className="w-24 border-r border-gray-400"></div>
                        <div className="w-24"></div>
                    </div>
                </div>

                {/* TOTALS */}
                <div className="border-t border-gray-400 flex text-sm">
                    {/* LEFT COLUMN: AMOUNT IN WORDS */}
                    <div className="flex-1 p-3 border-r border-gray-400 flex flex-col justify-center">
                        <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Amount in Words</span>
                        <p className="italic font-bold text-gray-800 leading-tight">
                            {amountToWords(data.grandTotal)} Only
                        </p>
                    </div>

                    {/* RIGHT COLUMN: CALCULATION DETAILS */}
                    <div className="w-96 flex flex-col">
                        <div className="flex border-b border-gray-400">
                            <div className="flex-1 p-2 font-bold text-right border-r border-gray-400">Total Amount before Tax:</div>
                            <div className="w-24 p-2 text-right font-bold">{data.subTotal}</div>
                        </div>
                        <div className="flex border-b border-gray-400">
                            <div className="flex-1 p-2 text-right border-r border-gray-400">Add: {parseInt(data.taxPercentage) / 2}% CGST</div>
                            <div className="w-24 p-2 text-right">{(data.subTotal * (parseInt(data.taxPercentage) / 2)) / 100}</div>
                        </div>
                        <div className="flex border-b border-gray-400">
                            <div className="flex-1 p-2 text-right border-r border-gray-400">Add: {parseInt(data.taxPercentage) / 2}% SGST</div>
                            <div className="w-24 p-2 text-right">{(data.subTotal * (parseInt(data.taxPercentage) / 2)) / 100}</div>
                        </div>
                        <div className="flex bg-gray-100 font-bold">
                            <div className="flex-1 p-2 text-right border-r border-gray-400">Grand Total:</div>
                            <div className="w-24 p-2 text-right" style={{ color: borderColor }}>{data.grandTotal}</div>
                        </div>
                    </div>
                </div>

                {/* FOOTER & BANK */}
                <div className="flex border-t border-gray-400">
                    <div className="w-1/2 p-2 border-r border-gray-400 text-xs">
                        <h4 className="font-bold underline mb-1">Bank Details</h4>
                        <p>Bank Name: {businessSettings.bankName}</p>
                        <p>A/C No: {businessSettings.bankAccountNumber}</p>
                        <p>IFSC: {businessSettings.bankIfscCode}</p>
                        <div className="mt-4">
                            <h4 className="font-bold underline mb-1">Terms & Conditions</h4>
                            <p>{settings.customFooterText}</p>
                        </div>
                    </div>
                    <div className="w-1/2 p-2 flex flex-col justify-between text-center">
                        <p className="text-xs mt-2">Certified that the particulars given above are true and correct</p>
                        <div className="mb-4 flex flex-col items-center">
                            <p className="font-bold mb-2">For {businessSettings.businessName}</p>
                            {settings.showSignature && (
                                <div className="h-10 w-28 flex items-center justify-center overflow-hidden mb-1">
                                    {businessSettings?.signature ? (
                                        <img src={`${BASE_URL}${businessSettings.signature}`} alt="Signature" className="max-h-full max-w-full object-contain" />
                                    ) : (
                                        <div className="h-6"></div>
                                    )}
                                </div>
                            )}
                            <p className="text-xs font-semibold text-gray-650">(Authorized Signatory)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoicePreview2;
