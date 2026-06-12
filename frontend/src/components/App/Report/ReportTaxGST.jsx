import React, { useMemo } from "react";
import { Landmark, Scale, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const ReportTaxGST = ({ sales, purchases }) => {
  // Aggregate GST values
  const gstSummary = useMemo(() => {
    let outputGst = 0;
    let inputGst = 0;

    // GST Rates Breakdown (5%, 12%, 18%, 28%, etc.)
    const ratesBreakdown = {
      0: { rate: 0, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 },
      5: { rate: 5, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 },
      12: { rate: 12, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 },
      18: { rate: 18, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 },
      28: { rate: 28, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 },
    };

    const addToRateBreakdown = (rate, taxable, tax, type) => {
      // Find closest standard rate or create custom if needed
      const standardRates = [0, 5, 12, 18, 28];
      let closestRate = standardRates.reduce((prev, curr) => 
        Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev
      );

      // Fallback for custom rate
      if (!ratesBreakdown[closestRate]) {
        ratesBreakdown[closestRate] = { rate: closestRate, salesTaxable: 0, salesTax: 0, purchaseTaxable: 0, purchaseTax: 0 };
      }

      const entry = ratesBreakdown[closestRate];
      if (type === "sales") {
        entry.salesTaxable += taxable;
        entry.salesTax += tax;
      } else {
        entry.purchaseTaxable += taxable;
        entry.purchaseTax += tax;
      }
    };

    sales.forEach((s) => {
      const sub = parseFloat(s.subTotal) || 0;
      const rate = parseFloat(s.taxPercentage) || 0;
      const tax = sub * (rate / 100);
      outputGst += tax;
      addToRateBreakdown(rate, sub, tax, "sales");
    });

    purchases.forEach((p) => {
      const sub = parseFloat(p.subTotal) || 0;
      const rate = parseFloat(p.taxPercentage) || 0;
      const tax = sub * (rate / 100);
      inputGst += tax;
      addToRateBreakdown(rate, sub, tax, "purchases");
    });

    const netTaxLiability = outputGst - inputGst;

    return {
      outputGst,
      inputGst,
      netTaxLiability,
      ratesList: Object.values(ratesBreakdown).filter(
        (r) => r.salesTaxable > 0 || r.purchaseTaxable > 0
      )
    };
  }, [sales, purchases]);

  return (
    <div className="space-y-6">
      {/* GST Summary KPI Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Output Tax */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output GST (Collected on Sales)</p>
            <p className="text-2xl font-bold text-gray-900">₹{gstSummary.outputGst.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 border border-emerald-100">
            <ArrowUpRight className="size-5" />
          </div>
        </div>

        {/* KPI 2: Input Tax Credit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input GST (Tax Paid to Vendors)</p>
            <p className="text-2xl font-bold text-gray-900">₹{gstSummary.inputGst.toFixed(2)}</p>
          </div>
          <div className="bg-violet-50 p-2.5 rounded-lg text-violet-600 border border-violet-100">
            <ArrowDownLeft className="size-5" />
          </div>
        </div>

        {/* KPI 3: Net Payable */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net GST Payable / Credit</p>
            <p className={`text-2xl font-bold ${gstSummary.netTaxLiability >= 0 ? "text-violet-600" : "text-emerald-600"}`}>
              {gstSummary.netTaxLiability >= 0 ? "+" : "-"} ₹{Math.abs(gstSummary.netTaxLiability).toFixed(2)}
            </p>
          </div>
          <div className={`p-2.5 rounded-lg border ${gstSummary.netTaxLiability >= 0 ? "bg-violet-50 text-violet-600 border-violet-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
            <Landmark className="size-5" />
          </div>
        </div>
      </div>

      {/* Tax Rate Categories Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Scale className="size-5 text-violet-600" /> GST Rate-Wise Classification
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-700 uppercase font-semibold text-xs tracking-wider">
                <th className="px-4 py-3">GST Rate</th>
                <th className="px-3 py-3 text-right">Taxable Sales Inflow</th>
                <th className="px-3 py-3 text-right">Output GST Collected</th>
                <th className="px-3 py-3 text-right">Taxable Purchase Cost</th>
                <th className="px-3 py-3 text-right">Input GST Paid</th>
                <th className="px-3 py-3 text-right">Net GST Liability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gstSummary.ratesList.length > 0 ? (
                gstSummary.ratesList.map((item) => {
                  const net = item.salesTax - item.purchaseTax;
                  return (
                    <tr key={item.rate} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        GST @ {item.rate}%
                      </td>
                      <td className="px-3 py-3 text-right text-gray-600 font-medium">
                        ₹{item.salesTaxable.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-emerald-600">
                        ₹{item.salesTax.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right text-gray-600 font-medium">
                        ₹{item.purchaseTaxable.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-violet-600">
                        ₹{item.purchaseTax.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className={`font-bold ${net >= 0 ? "text-violet-600" : "text-emerald-600"}`}>
                          {net >= 0 ? "+" : "-"} ₹{Math.abs(net).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                    No taxable transactions found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportTaxGST;
