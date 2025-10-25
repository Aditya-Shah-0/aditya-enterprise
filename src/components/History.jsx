import React, { useState, useMemo } from "react";
import { formatCurrency, getTodayString } from "./utils";


export const History = ({ sales, expenses }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const combinedTransactions = useMemo(() => {
    const allSales = sales.map(s => ({ ...s, type: 'sale' }));
    const allExpenses = expenses.map(e => ({ ...e, type: 'purchase' }));

    return [...allSales, ...allExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sales, expenses]);

  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter(t => t.date.startsWith(selectedDate));
  }, [combinedTransactions, selectedDate]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">Transaction History</h2>
      <div className="mb-6">
        <label htmlFor="historyDate" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Select Date</label>
        <input
          type="date"
          id="historyDate"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-gray-200 dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600 p-2"
        />
      </div>
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(t => (
            <div key={t.id} className={`bg-gray-100 shadow-2xl drop-shadow-black dark:bg-gray-700 p-4 rounded-lg border-l-4 ${t.type === 'sale' ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-bold text-lg ${t.type === 'sale' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'sale' ? 'Sale To' : 'Purchase Of'}
                  </p>
                  <p className="font-semibold">{t.type === 'sale' ? t.partyName : t.materialName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleString()}</p>
                </div>
                <p className={`font-bold text-lg ${t.type === 'sale' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {t.type === 'sale' ? '+' : '-'} {formatCurrency(t.total)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black dark:text-gray-400 text-center py-8">No transactions for this date....</p>
        )}
      </div>
    </div>
  );
};