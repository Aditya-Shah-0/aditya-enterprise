import React, { useMemo, useState } from "react";
import { getTodayString } from "./utils";
import { SalesList } from './SalesList';

export const InvoiceHistory = ({ sales, onViewInvoice }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const filteredSales = useMemo(() => sales.filter(sale => sale.date.startsWith(selectedDate)), [sales, selectedDate]);
 
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-fuchsia-700/50">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">Invoice History</h2>
      <div className="mb-6">
        <label htmlFor="saleDate" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Select Date</label>
        <input
          type="date"
          id="saleDate"
          defaultValue={getTodayString()}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-gray-200 dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600 p-2" />
      </div>
      <SalesList sales={filteredSales} onViewInvoice={onViewInvoice} />
    </div>);
};