import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { amountToWords } from '../../../../utils/amountToWords';

const InvoicePreview3 = ({ settings, data }) => {
    const { owner } = useAuth();
    const businessSettings = owner?.businessSettings;

    if (!businessSettings) return null;

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

    return (
        <div
            className="bg-white shadow-2xl mx-auto text-sm text-gray-800 relative overflow-hidden flex flex-col"
            style={{
                width: '210mm',
                height: '297mm',
                padding: '10mm',
                border: `1px solid #ccc`
            }}
        >
            {/* WATERMARK */}
            {settings.showLogo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] pointer-events-none select-none">
                    <h1 className="text-[150px] -rotate-45 font-black uppercase text-gray-900">{businessSettings.businessName?.substring(0, 20) || "COMPANY"}</h1>
                </div>
            )}

            {/* TOP HEADER BOX */}
            <div className="border border-gray-800 mb-0">
                <div className="flex justify-between items-center bg-gray-50 border-b border-gray-800 px-4 py-1">
                    <span className="text-xs">All India Delivery Avail.</span>
                    <span className="font-bold underline uppercase tracking-wider text-sm border-2 border-black px-2 bg-white">Tax Invoice</span>
                    <span className="text-xs font-bold">(M) {businessSettings.companyPhone}</span>
                </div>

                <div className="py-3 px-4 flex items-center justify-center relative min-h-[112px]">
                    {settings.showLogo && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                            {businessSettings?.logo ? (
                                <img src={`${BASE_URL}${businessSettings.logo}`} alt="Logo" className="max-w-[120px] max-h-16 object-contain" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                    LOGO
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center text-center">
                        {settings.showBusinessName && (
                            <h1 className="text-4xl font-extrabold text-red-600 uppercase mb-2" style={{ color: settings.themeColor }}>
                                {businessSettings.businessName}
                            </h1>
                        )}
                        {settings.showCompanyAddress && (
                            <p className="text-gray-600 text-xs font-medium uppercase">
                                {businessSettings.billingAddress}, {businessSettings.city} - {businessSettings.pincode}
                            </p>
                        )}
                        {businessSettings.companyEmail && <p className="text-xs text-blue-600 underline">{businessSettings.companyEmail}</p>}
                        {businessSettings.gstNumber && <p className="text-sm font-extrabold text-gray-700">GSTIN: {businessSettings.gstNumber}</p>}
                    </div>
                </div>
            </div>

            {/* CLIENT DETAILS */}
            <div className="border border-t-0 border-gray-800 flex text-sm">
                <div className="flex-1 p-2 border-r border-gray-800 space-y-2">
                    <div className="flex">
                        <span className="w-16">M/s.:</span>
                        <span className="font-bold uppercase border-b border-dotted border-gray-400 flex-1">{data.partyName}</span>
                    </div>
                    <div className="flex">
                        <span className="w-16">Address:</span>
                        <span className="border-b border-dotted border-gray-400 flex-1">{data.partyAddress}</span>
                    </div>
                    <div className="flex text-xs">
                        <span className="w-16">State:</span>
                        <span className="border-b border-dotted border-gray-400 flex-1">{data.stateOfSupply}</span>
                    </div>
                </div>
                <div className="w-1/3 p-2 space-y-2">
                    <div className="flex">
                        <span className="w-24">Invoice No:</span>
                        <span className="font-bold">{data.invoiceNo}</span>
                    </div>
                    <div className="flex">
                        <span className="w-24">Date:</span>
                        <span className="font-bold">{data.date.split('T')[0]}</span>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="border border-t-0 border-gray-800 flex-1 flex flex-col">
                <div className="flex bg-gray-200 border-b border-gray-800 font-bold text-center text-sm uppercase">
                    <div className="w-12 border-r border-gray-800 py-2">Sl.No.</div>
                    <div className="flex-1 border-r border-gray-800 py-2">Particulars / Description</div>
                    <div className="w-16 border-r border-gray-800 py-2">Qty.</div>
                    <div className="w-20 border-r border-gray-800 py-2">Rate</div>
                    <div className="w-24 py-2">Amount</div>
                </div>

                {data.particulars.map((item, index) => (
                    <div key={index} className="flex text-sm border-b border-gray-200">
                        <div className="w-12 border-r border-gray-800 p-1 text-center">{index + 1}</div>
                        <div className="flex-1 border-r border-gray-800 p-1 px-3">
                            <p className="font-bold uppercase">{item.name}</p>
                            {settings.showItemDescription && <p className="text-xs text-gray-500 italic">{item.description}</p>}
                        </div>
                        <div className="w-16 border-r border-gray-800 p-1 text-center">{item.qty}</div>
                        <div className="w-20 border-r border-gray-800 p-1 text-right">{item.price}</div>
                        <div className="w-24 p-1 text-right font-bold">{(item.qty * item.price)}</div>
                    </div>
                ))}

                <div className="flex-1 flex border-b border-gray-200">
                    <div className="w-12 border-r border-gray-800 p-1"></div>
                    <div className="flex-1 border-r border-gray-800 p-1"></div>
                    <div className="w-16 border-r border-gray-800 p-1"></div>
                    <div className="w-20 border-r border-gray-800 p-1"></div>
                    <div className="w-24 p-1"></div>
                </div>
            </div>

            {/* TOTALS */}
            <div className="border border-t-0 border-gray-800 flex">
                <div className="flex-1 p-2 border-r border-gray-800">
                    <p className="text-xs mb-1">Total Rs. (in words):</p>
                    <p className="text-xs font-bold italic h-6 border-b border-dotted border-gray-400">
                        {amountToWords(data.grandTotal)} Only /-
                    </p>
                    <div className="mt-4 text-[10px] text-gray-500 leading-tight">
                        <p className="font-bold underline text-gray-700">Terms & Conditions:</p>
                        <ul className="list-decimal pl-3 mt-1">
                            <li>Goods once sold will not be taken back.</li>
                            <li>Interest @24% p.a. will be charged if bill is not paid on due date.</li>
                            <li>Subject to local jurisdiction only.</li>
                        </ul>
                    </div>
                </div>
                <div className="w-44 text-sm">
                    <div className="flex justify-between p-1 border-b border-gray-800">
                        <span>Total:</span>
                        <span className="font-bold">{data.subTotal}</span>
                    </div>
                    <div className="flex justify-between p-1 border-b border-gray-800 text-xs text-gray-500">
                        <span>CGST:</span>
                        <span>{parseInt(data.taxPercentage) / 2}%</span>
                    </div>
                    <div className="flex justify-between p-1 border-b border-gray-800 text-xs text-gray-500">
                        <span>SGST:</span>
                        <span>{parseInt(data.taxPercentage) / 2}%</span>
                    </div>
                    <div className="flex justify-between p-2 font-bold bg-yellow-50">
                        <span>G. Total:</span>
                        <span className="text-red-600">{data.grandTotal}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER SIGNATURE */}
            <div className="border border-t-0 border-gray-800 p-2 flex justify-between items-end bg-red-50" style={{ backgroundColor: `${settings.themeColor}10` }}>
                <p className="text-[10px] text-gray-500">E. & O.E.</p>
                <div className="text-center flex flex-col items-center">
                    <p className="text-xs font-bold text-red-600 mb-1" style={{ color: settings.themeColor }}>For {businessSettings.businessName}</p>
                    {settings.showSignature && (
                        <div className="h-10 w-28 flex items-center justify-center overflow-hidden mb-1">
                            {businessSettings?.signature ? (
                                <img src={`${BASE_URL}${businessSettings.signature}`} alt="Signature" className="max-h-full max-w-full object-contain" />
                            ) : (
                                <div className="h-6"></div>
                            )}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 border-t border-gray-500 pt-1 px-4">Auth. Signature</p>
                </div>
            </div>

        </div>
    );
};

export default InvoicePreview3;
