import React, { useMemo } from "react";
import { formatCurrency } from "./utils";
import { StatCard } from "./StatCard";
import { TrendingUpIcon, CalendarIcon, ChartIcon } from "./Icons";

export const Dashboard = ({ sales, expenses }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    let todaySales = 0, monthSales = 0, yearSales = 0;

    sales.forEach(s => {
      const saleDate = new Date(s.date);
      if (s.date.slice(0, 10) === todayStr) todaySales += s.total;
      if (saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear) monthSales += s.total;
      if (saleDate.getFullYear() === thisYear) yearSales += s.total;
    });

    let todayExpenses = 0, monthExpenses = 0, yearExpenses = 0;

    expenses.forEach(e => {
      const expenseDate = new Date(e.date);
      if (e.date.slice(0, 10) === todayStr) todayExpenses += e.total;
      if (expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear) monthExpenses += e.total;
      if (expenseDate.getFullYear() === thisYear) yearExpenses += e.total;
    });

    return {
      todayProfit: todaySales - todayExpenses,
      monthProfit: monthSales - monthExpenses,
      yearProfit: yearSales - yearExpenses,
    };
  }, [sales, expenses]);

  const recentSales = sales.slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Profit" value={formatCurrency(stats.todayProfit)} icon={<TrendingUpIcon className="h-6 w-6 text-blue-400" />} />
        <StatCard title="This Month's Profit" value={formatCurrency(stats.monthProfit)} icon={<CalendarIcon className="h-6 w-6 text-blue-400" />} />
        <StatCard title="This Year's Profit" value={formatCurrency(stats.yearProfit)} icon={<ChartIcon className="h-6 w-6 text-blue-400" />} />
      </div>
      <div className="mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-sky-700/50">
        <h3 className="text-xl font-semibold text-black dark:text-gray-300 mb-4">Recent Sales</h3>
        {recentSales.length > 0 ? (<div className="space-y-3">
          {recentSales.map(sale => (<div key={sale.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center shadow-black/20 drop-shadow-2xl">
            <div>
              <p className="font-semibold text-black dark:text-white">{sale.partyName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(sale.date).toLocaleDateString()}</p>
            </div>
            <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(sale.total)}</span>
          </div>
          ))}
        </div>) :
          (<p className="text-black dark:text-gray-400 text-center py-4">No recent sales...</p>)
        }
      </div>
    </div>
  );
};