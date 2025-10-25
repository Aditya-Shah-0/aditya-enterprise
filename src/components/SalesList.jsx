import React from "react";
import { formatCurrency } from "./utils";

export const SalesList = ({ sales, onViewInvoice }) => {
    if (sales.length === 0) return <p className="text-center text-black py-8">No sales for this period...</p>;
    return (
        <div className="space-y-4">
            {sales.map(sale => (
                <div key={sale.id} className="bg-gray-100 shadow-2xl drop-shadow-black dark:bg-gray-700 p-4 rounded-lg">
                    {/* Sale Header: Party Name, Date, and Total */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg text-black dark:text-white">
                                {sale.partyName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(sale.date).toLocaleString()}
                            </p>
                        </div>
                        <p className="font-bold text-lg text-green-600 dark:text-green-400">
                            {formatCurrency(sale.total)}
                        </p>
                    </div>

                    <ul className="mt-3 border-t border-black dark:border-gray-600 pt-3 space-y-1">
                        {sale.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                <span>{item.productName} ({item.quantity})</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="mt-4 text-right">
                        {onViewInvoice && (
                            <button
                                onClick={() => onViewInvoice(sale)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-md font-semibold rounded-md hover:bg-blue-700 transition-colors">
                                View Invoice
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};