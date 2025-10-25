import React, { useMemo } from "react";
import { getMonthYear, formatCurrency } from "./utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ReportGraphs = ({ sales, expenses }) => {
  const chartData = useMemo(() => {
    const data = {};
    [...sales, ...expenses].forEach(item => {
      const date = new Date(item.date);
      const month = getMonthYear(date);
      if (!data[month]) data[month] = { name: month, Sales: 0, Expenses: 0, Profit: 0 };
      if (item.partyName) data[month].Sales += item.total;
      else data[month].Expenses += item.total;
    });
    Object.values(data).forEach(d => d.Profit = d.Sales - d.Expenses);
    return Object.values(data).sort((a, b) => new Date(`1 ${a.name}`) - new Date(`1 ${b.name}`));
  }, [sales, expenses]);
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300">Financial Graphs</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} labelStyle={{ color: '#1f2937' }} formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Sales" fill="#10b981" />
            <Bar dataKey="Expenses" fill="#ef4444" />
            <Bar dataKey="Profit" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};