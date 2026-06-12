import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { amountToWords } from '../../../../utils/amountToWords';

const InvoicePreview4 = ({ settings, data }) => {
    const { owner } = useAuth();
    const businessSettings = owner?.businessSettings;

    if (!businessSettings) return null;

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

    return (
        <div
            className="bg-white shadow-2xl mx-auto text-sm text-gray-800 font-sans flex flex-col"
            style={{
                width: '210mm',
                height: '297mm',
                padding: '10mm',
            }}
        >
            <div className="border-2 border-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col">

                {/* TOP HEADER PILL */}
                <div className="flex justify-center mb-2">
                    <span className="bg-gray-800 text-white px-8 py-2 rounded-full font-bold uppercase tracking-widest text-sm border-4 border-white">
                        Sale / Tax Invoice
                    </span>
                </div>

                {/* HEADER INFO */}
                <div className="px-8 border-b-2 border-gray-800 pb-6 relative flex items-center justify-center min-h-[140px]">
                    {settings.showLogo && (
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center">
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
                            <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 mb-2">
                                {businessSettings.businessName}
                            </h1>
                        )}
                        {settings.showCompanyAddress && (
                            <div className="border-2 border-gray-800 rounded-full py-1 px-4 inline-block font-medium text-sm">
                                GSTIN: {businessSettings.gstNumber || '----------------'}
                            </div>
                        )}
                        <div className="flex justify-center gap-6 mt-2 text-xs font-bold px-4 w-full">
                            <span>{businessSettings.billingAddress}, {businessSettings.city}</span>
                            <span>Phone: {businessSettings.companyPhone}</span>
                        </div>
                    </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-2 border-b-2 border-gray-800">
                    <div className="p-4 border-r-2 border-gray-800">
                        <div className="flex gap-2 mb-6">
                            <span className="text-gray-500 w-20">Name:</span>
                            <span className="font-bold border-b border-gray-400 border-dotted flex-1 text-lg">{data.partyName}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-gray-500 w-20">Address:</span>
                            <span className="border-b border-gray-400 border-dotted flex-1 h-5">{data.partyAddress}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <div className="border border-gray-800 rounded p-1 w-24 text-center">
                                <span className="block text-[10px] uppercase text-gray-500">Book No.</span>
                                <span className="font-bold">{(parseInt(data.invoiceNo?.split('-')[1]) / 100).toFixed(0)}</span>
                            </div>
                            <div className="border border-gray-800 rounded p-1 w-24 text-center">
                                <span className="block text-[10px] uppercase text-gray-500">Serial No.</span>
                                <p className="font-bold text-red-600">{data.invoiceNo}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">Date:</span>
                            <span>{data.date.split('T')[0]}</span>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="flex-1 flex flex-col">
                    <div className="flex border-b-2 border-gray-800 font-bold bg-gray-100 text-center">
                        <div className="w-12 py-3 border-r-2 border-gray-800">Sl.</div>
                        <div className="flex-1 py-3 border-r-2 border-gray-800">Particulars</div>
                        <div className="w-20 py-3 border-r-2 border-gray-800">Qty</div>
                        <div className="w-24 py-3 border-r-2 border-gray-800">Rate</div>
                        <div className="w-32 py-3">Amount</div>
                    </div>

                    {data.particulars.map((item, index) => (
                        <div key={index} className="flex border-b border-gray-200 h-12">
                            <div className="w-12 py-2 border-r-2 border-gray-800 text-center">{index + 1}</div>
                            <div className="flex-1 py-2 border-r-2 border-gray-800 px-4 font-medium">{item.name}
                                <p className="text-xs text-gray-400">{item.description}</p>
                            </div>
                            <div className="w-20 py-2 border-r-2 border-gray-800 text-center">{item.qty}</div>
                            <div className="w-24 py-2 border-r-2 border-gray-800 text-right px-2">{item.price}</div>
                            <div className="w-32 py-2 text-right px-4 font-bold">{(item.qty * item.price)}</div>
                        </div>
                    ))}

                    {/* FILLER */}
                    <div className="flex-1 flex">
                        <div className="w-12 border-r-2 border-gray-800"></div>
                        <div className="flex-1 border-r-2 border-gray-800"></div>
                        <div className="w-20 border-r-2 border-gray-800"></div>
                        <div className="w-24 border-r-2 border-gray-800"></div>
                        <div className="w-32"></div>
                    </div>
                </div>

                {/* FOOTER TOTALS */}
                <div className="border-t-2 border-gray-800">
                    <div className="flex">
                        <div className="flex-1 border-r-2 border-gray-800 py-3 px-6">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total in words:</p>
                            <p className="italic font-medium border-b border-gray-400 pb-1">{amountToWords(data.grandTotal)} Only</p>

                            <div className="mt-4 text-lg text-gray-600">
                                <p>Bank Details:</p>
                                <p>{businessSettings.bankName}</p>
                                <p>{businessSettings.bankAccountNumber}</p>
                                <p>{businessSettings.bankIfscCode}</p>
                            </div>
                        </div>
                        <div className="w-64">
                            <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                                <span>Total Amount:</span>
                                <span className="font-bold">{data.subTotal}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                                <span>CGST: {data.taxPercentage / 2}%</span>
                                <span>₹{data.subTotal * ((data.taxPercentage / 2) / 100)}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 border-b-2 border-gray-800">
                                <span>SGST: {data.taxPercentage / 2}%</span>
                                <span>₹{data.subTotal * ((data.taxPercentage / 2) / 100)}</span>
                            </div>
                            <div className="flex justify-between px-4 py-3 bg-gray-800 text-white font-bold text-lg">
                                <span>Total:</span>
                                <span>₹{data.grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIGNATURE */}
                <div className="flex justify-between items-end px-6 pb-2 bg-gray-50 text-xs text-gray-500">
                    <p>Subject to terms and conditions.</p>
                    <div className="text-center w-48 flex flex-col items-center">
                        <p className="mb-2 font-bold text-gray-900">For {businessSettings.businessName}</p>
                        {settings.showSignature && (
                            <div className="h-10 w-28 flex items-center justify-center overflow-hidden mb-1">
                                {businessSettings?.signature ? (
                                    <img src={`${BASE_URL}${businessSettings.signature}`} alt="Signature" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <div className="h-6"></div>
                                )}
                            </div>
                        )}
                        <p className="border-t border-gray-400 pt-1 w-full text-center">Authorized Signatory</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoicePreview4;
