import React from 'react';
import { useAuth } from '../../../../context/AuthContext';

const InvoicePreview = ({ settings, data }) => {
    const { owner } = useAuth();
    const businessSettings = owner?.businessSettings;

    if (!businessSettings) return null;

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

    // Styles based on theme color
    const themeStyle = { color: settings.themeColor };
    const bgThemeStyle = { backgroundColor: settings.themeColor };

    return (
        // A4 PAPER ASPECT RATIO WRAPPER
        <div
            className="bg-white shadow-2xl mx-auto text-sm leading-relaxed text-gray-700 flex flex-col"
            style={{
                width: '210mm', // Standard A4 Width
                height: '297mm', // Standard A4 Height
                padding: '10mm 15mm' // Print Margins
            }}
        >
            {/* HEADER */}
            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    {settings.showLogo && (
                        businessSettings?.logo ? (
                            <img src={`${BASE_URL}${businessSettings.logo}`} alt="Logo" className="max-w-[120px] max-h-16 object-contain mb-4" />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded mb-4 flex items-center justify-center text-xs text-gray-500 font-bold">
                                LOGO
                            </div>
                        )
                    )}
                    {settings.showBusinessName && <h1 className="text-2xl font-bold text-gray-900">{businessSettings.businessName}</h1>}
                    {settings.showCompanyAddress && (
                        <p className="text-gray-500 mt-1 text-xs max-w-[200px]">
                            {businessSettings.billingAddress}, {businessSettings.city} - {businessSettings.pincode}, {businessSettings.state}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <h2 className="text-4xl font-light uppercase tracking-widest opacity-20" style={themeStyle}>Invoice</h2>
                    <div className="mt-4">
                        <p><strong>Date:</strong> {data.date.split('T')[0]}</p>
                        <p><strong>Invoice :</strong> {data.invoiceNo}</p>
                    </div>
                </div>
            </div>

            {/* BILL TO */}
            <div className="mb-8 p-4 bg-gray-50 rounded" style={{ borderLeft: `4px solid ${settings.themeColor}` }}>
                <p className="text-xs uppercase text-gray-500 font-bold mb-1">Bill To:</p>
                <p className="font-bold text-lg text-gray-900">{data.partyName}</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">{data.partyAddress}</p>
            </div>

            {/* TABLE */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="text-left text-white" style={bgThemeStyle}>
                        <th className="p-3 text-sm font-semibold rounded-tl">Item</th>
                        <th className="p-3 text-sm font-semibold text-center">Qty</th>
                        <th className="p-3 text-sm font-semibold text-right rounded-tr">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data.particulars.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="p-3">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {settings.showItemDescription && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                            </td>
                            <td className="p-3 text-center">{item.qty}</td>
                            <td className="p-3 text-right">₹{item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALS */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Subtotal</span>
                        <span>₹{data.subTotal}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Tax ({data.taxPercentage}%)</span>
                        <span>₹{data.subTotal * (data.taxPercentage / 100)}</span>
                    </div>
                    <div className="flex justify-between py-3 font-bold text-xl" style={themeStyle}>
                        <span>Total</span>
                        <span>₹{data.grandTotal}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-auto pt-8 border-t border-gray-200 flex items-end justify-between">
                <div className="w-2/3">
                    <p className="font-bold text-xs uppercase text-gray-400 mb-2">Terms & Notes</p>
                    <p className="text-xs text-gray-500 italic">
                        "{settings.customFooterText}"
                    </p>
                </div>

                {settings.showSignature && (
                    <div className="text-center flex flex-col items-center">
                        <div className="h-12 w-32 border-b border-gray-400 mb-2 flex items-center justify-center overflow-hidden">
                            {businessSettings?.signature ? (
                                <img src={`${BASE_URL}${businessSettings.signature}`} alt="Signature" className="max-h-full max-w-full object-contain" />
                            ) : null}
                        </div>
                        <p className="text-xs font-bold text-gray-600">Authorized Signature</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default InvoicePreview;