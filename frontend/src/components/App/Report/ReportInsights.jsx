import React, { useMemo } from "react";
import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

export const ReportInsights = ({ sales, purchases }) => {
  // Aggregate Insights data
  const insights = useMemo(() => {
    // 1. Top Selling Products
    const itemsMap = {};
    sales.forEach((s) => {
      s.particulars?.forEach((item) => {
        const name = item.name;
        if (!name) return;
        if (!itemsMap[name]) {
          itemsMap[name] = { name, qty: 0, revenue: 0 };
        }
        itemsMap[name].qty += parseFloat(item.qty) || 0;
        itemsMap[name].revenue += parseFloat(item.amount) || 0;
      });
    });
    const topProducts = Object.values(itemsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 2. Top Customers (Highest Revenue Sales)
    const customersMap = {};
    sales.forEach((s) => {
      const name = s.partyName;
      if (!name) return;
      if (!customersMap[name]) {
        customersMap[name] = { name, revenue: 0, txns: 0 };
      }
      customersMap[name].revenue += parseFloat(s.grandTotal) || 0;
      customersMap[name].txns += 1;
    });
    const topCustomers = Object.values(customersMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 3. Top Suppliers (Highest Expense Purchases)
    const suppliersMap = {};
    purchases.forEach((p) => {
      const name = p.partyName;
      if (!name) return;
      if (!suppliersMap[name]) {
        suppliersMap[name] = { name, outflow: 0, txns: 0 };
      }
      suppliersMap[name].outflow += parseFloat(p.grandTotal) || 0;
      suppliersMap[name].txns += 1;
    });
    const topSuppliers = Object.values(suppliersMap)
      .sort((a, b) => b.outflow - a.outflow)
      .slice(0, 5);

    // 4. Payment Modes Breakdown
    const paymentModes = { Cash: 0, Bank: 0, UPI: 0, Credit: 0 };
    sales.forEach((s) => {
      const mode = s.paymentMode || "Cash";
      const total = parseFloat(s.grandTotal) || 0;
      if (paymentModes[mode] !== undefined) {
        paymentModes[mode] += total;
      } else {
        paymentModes["Cash"] += total;
      }
    });

    const totalSalesVol = Object.values(paymentModes).reduce((a, b) => a + b, 0);

    return { topProducts, topCustomers, topSuppliers, paymentModes, totalSalesVol };
  }, [sales, purchases]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* 1. Top Selling Products */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <ShoppingBag className="size-5 text-violet-600" /> Top Traded Products
        </h3>
        <div className="divide-y divide-gray-100">
          {insights.topProducts.length > 0 ? (
            insights.topProducts.map((item, idx) => (
              <div key={item.name} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 size-5.5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-gray-900">₹{item.revenue.toFixed(2)}</p>
                  <p className="text-gray-400 font-medium">{item.qty} units sold</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              No trading stock recorded.
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Revenue Customers */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Users className="size-5 text-violet-600" /> Key Customers (Sales)
        </h3>
        <div className="divide-y divide-gray-100">
          {insights.topCustomers.length > 0 ? (
            insights.topCustomers.map((cust, idx) => (
              <div key={cust.name} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 size-5.5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{cust.name}</span>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-gray-900">₹{cust.revenue.toFixed(2)}</p>
                  <p className="text-gray-400 font-medium">{cust.txns} invoice{cust.txns !== 1 && "s"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              No customer logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* 3. Top Suppliers */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Users className="size-5 text-violet-600" /> Primary Suppliers (Outflows)
        </h3>
        <div className="divide-y divide-gray-100">
          {insights.topSuppliers.length > 0 ? (
            insights.topSuppliers.map((supp, idx) => (
              <div key={supp.name} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 size-5.5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{supp.name}</span>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-gray-900">₹{supp.outflow.toFixed(2)}</p>
                  <p className="text-gray-400 font-medium">{supp.txns} bill{supp.txns !== 1 && "s"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              No supplier logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* 4. Payment Modes Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <CreditCard className="size-5 text-violet-600" /> Sales Payment Modes
        </h3>
        <div className="space-y-4">
          {insights.totalSalesVol > 0 ? (
            Object.entries(insights.paymentModes).map(([mode, amt]) => {
              const pct = (amt / insights.totalSalesVol) * 100;
              return (
                <div key={mode} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>{mode}</span>
                    <span className="font-semibold text-gray-900">
                      ₹{amt.toFixed(2)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Progress Indicator Bar */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        mode === "Cash" 
                          ? "bg-emerald-500" 
                          : mode === "Bank" 
                          ? "bg-blue-500" 
                          : mode === "UPI" 
                          ? "bg-violet-500" 
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              No transactions recorded for payment analysis.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReportInsights;
