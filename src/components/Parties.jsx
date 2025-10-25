import React, { useState, useMemo } from "react";
import { formatCurrency } from "./utils";
import { SalesList } from "./SalesList";

export const Parties = ({ sales, onViewInvoice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState(null);
  const parties = useMemo(() => {
    const uniqueParties = sales.filter(sale => sale.partyName).reduce((acc, sale) => {
      if (!acc[sale.partyName]) {
        acc[sale.partyName] = { name: sale.partyName, phone: sale.partyPhone, totalSpent: 0, saleCount: 0 };
      }
      acc[sale.partyName].totalSpent += sale.total;
      acc[sale.partyName].saleCount += 1;
      return acc;
    }, {});
    return Object.values(uniqueParties).sort((a, b) => a.name.localeCompare(b.name));
  }, [sales]);

  const filteredParties = parties.filter(c => c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (selectedParty) {
    const partySales = sales.filter(s => s.partyName === selectedParty.name);
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <button onClick={() => setSelectedParty(null)} className="mb-4 text-indigo-400 hover:text-indigo-300">&larr; Back to Parties List</button>
        <h2 className="text-2xl font-semibold mb-1 text-white">{selectedParty.name}</h2>
        <p className="text-gray-400 mb-4">Phone: {selectedParty.phone}</p>
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Transaction History</h3>
        <SalesList sales={partySales} onViewInvoice={onViewInvoice} />
      </div>
    )
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg drop-shadow-black">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300">Parties</h2>
      <input
        type="text"
        placeholder="Search parties..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 mb-4 border-gray-300 dark:border-gray-600" />
      <div className="space-y-3">{filteredParties.map(party => (
        <div
          key={party.name}
          onClick={() => setSelectedParty(party)}
          className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-600 transition-colors shadow-2xl drop-shadow-black">
          <div>
            <p className="font-semibold text-black dark:text-white">{party.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{party.saleCount} transactions</p>
          </div>
          <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(party.totalSpent)}</span>
        </div>
      ))}
      </div>
    </div>
  );
};