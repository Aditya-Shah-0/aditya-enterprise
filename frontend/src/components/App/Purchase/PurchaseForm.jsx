import React, { useState, useEffect, useMemo } from "react";
import { Save, Plus, ShoppingCart, User, Receipt, Trash2 } from "lucide-react";
import { purchaseService } from "../../../services/purchaseService";
import { itemService } from "../../../services/ItemService";
import toast from "react-hot-toast";

const generateInvoiceNo = (count) => {
  return "PUR-" + new Date().getFullYear().toString() + "-" + (1001 + count).toString();
};

const PurchaseForm = ({ uniqueVendors, billingMode, transactionsCount, onSuccess }) => {
  // Form States
  const [partyName, setPartyName] = useState("");
  const [partyAddress, setPartyAddress] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Particulars list
  const [particulars, setParticulars] = useState([]);

  // Active Item Input States
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(18);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(0);

  // Suggestions state
  const [stockItems, setStockItems] = useState([]);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [showVendorSuggestions, setShowVendorSuggestions] = useState(false);

  // Auto-generate invoice number on count change
  useEffect(() => {
    setInvoiceNo(generateInvoiceNo(transactionsCount));
  }, [transactionsCount]);

  // Load stock items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();
        setStockItems(data.items || []);
      } catch (error) {
        console.error("Failed to fetch stock items", error);
      }
    };
    fetchItems();
  }, []);

  // Derived values
  const subTotal = useMemo(() => {
    let sum = particulars.reduce((acc, item) => acc + item.amount, 0);
    if (itemName.trim()) {
      sum += billingMode === 'amount_based' ? totalAmount : qty * price;
    }
    return sum;
  }, [particulars, itemName, qty, price, totalAmount, billingMode]);

  const totals = useMemo(() => {
    const discountAmount = subTotal * (discountPercentage / 100);
    const taxAmount = subTotal * (taxPercentage / 100);
    const grandTotal = subTotal - discountAmount + taxAmount;
    const balance = grandTotal - paidAmount;
    return { discountAmount, taxAmount, grandTotal, balance };
  }, [subTotal, discountPercentage, taxPercentage, paidAmount]);

  const handleAddItem = (e) => {
    e?.preventDefault();
    if (!itemName.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    let itemPrice = price;
    let itemAmount = qty * price;

    if (billingMode === 'amount_based') {
      if (totalAmount < 0) {
        toast.error("Total amount cannot be negative");
        return;
      }
      itemPrice = totalAmount / qty;
      itemAmount = totalAmount;
    } else {
      if (price < 0) {
        toast.error("Price cannot be negative");
        return;
      }
    }

    const newItem = {
      name: itemName.trim(),
      qty,
      price: itemPrice,
      amount: itemAmount
    };
    setParticulars([...particulars, newItem]);
    setItemName("");
    setQty(1);
    setPrice(0);
    setTotalAmount(0);
    toast.success("Item added to bill list");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partyName.trim()) {
      toast.error("Vendor/Party name is required");
      return;
    }

    let finalParticulars = [...particulars];

    // Auto-add current typed item if filled
    if (itemName.trim()) {
      let itemPrice = price;
      let itemAmount = qty * price;

      if (billingMode === 'amount_based') {
        itemPrice = totalAmount / qty;
        itemAmount = totalAmount;
      }

      finalParticulars.push({
        name: itemName.trim(),
        qty,
        price: itemPrice,
        amount: itemAmount
      });
    }

    if (finalParticulars.length === 0) {
      toast.error("Please add at least one item to the purchase");
      return;
    }

    const payload = {
      partyName: partyName.trim(),
      partyAddress: partyAddress.trim(),
      partyPhone: partyPhone.trim(),
      gstNumber: gstNumber.trim(),
      invoiceNo: invoiceNo.trim(),
      date,
      dueDate,
      particulars: finalParticulars,
      subTotal,
      discountPercentage,
      taxPercentage,
      grandTotal: totals.grandTotal,
      paidAmount,
      balance: totals.balance,
      isPaid: totals.balance <= 0,
      paymentMode
    };

    try {
      await purchaseService.addPurchase(payload);
      toast.success("Purchase recorded successfully");

      // Reset form
      setPartyName("");
      setPartyAddress("");
      setPartyPhone("");
      setGstNumber("");
      setItemName("");
      setQty(1);
      setPrice(0);
      setTotalAmount(0);
      setDiscountPercentage(0);
      setPaidAmount(0);
      setParticulars([]);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to record purchase");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm self-start">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
        <ShoppingCart className="size-6 text-violet-600" />
        <h3 className="text-lg font-bold text-gray-900">Record New Purchase</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Vendor / Party Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={partyName}
                onChange={(e) => {
                  setPartyName(e.target.value);
                  setShowVendorSuggestions(true);
                }}
                onFocus={() => setShowVendorSuggestions(true)}
                onBlur={() => setTimeout(() => setShowVendorSuggestions(false), 200)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
                required
              />
              {showVendorSuggestions && partyName && uniqueVendors.filter(v => v.name.toLowerCase().includes(partyName.toLowerCase())).length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {uniqueVendors
                    .filter(v => v.name.toLowerCase().includes(partyName.toLowerCase()))
                    .map((vendor, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => {
                          setPartyName(vendor.name);
                          if (vendor.gst) setGstNumber(vendor.gst);
                          if (vendor.address) setPartyAddress(vendor.address);
                          if (vendor.phone) setPartyPhone(vendor.phone);
                          setShowVendorSuggestions(false);
                        }}
                      >
                        <div className="font-semibold">{vendor.name}</div>
                        {vendor.phone && <div className="text-xs text-gray-500 font-semibold">📞 {vendor.phone}</div>}
                        <div className="text-xs text-gray-400 truncate">{vendor.address}</div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              GST Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 22AAAAA0000A1Z5"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Vendor Phone Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={partyPhone}
              onChange={(e) => setPartyPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Vendor Address (Optional)
            </label>
            <textarea
              placeholder="Enter billing address"
              value={partyAddress}
              onChange={(e) => setPartyAddress(e.target.value)}
              rows="1"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Invoice/Bill No
            </label>
            <div className="relative">
              <Receipt className="absolute left-3 top-2.5 size-4 text-gray-400" />
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDueDate(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Details</h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-lg border border-violet-200/50 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Item to List
            </button>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Item / Material Name"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  setShowItemSuggestions(true);
                }}
                onFocus={() => setShowItemSuggestions(true)}
                onBlur={() => setTimeout(() => setShowItemSuggestions(false), 200)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm font-medium"
              />
              {showItemSuggestions && itemName && stockItems.filter(i => i.name.toLowerCase().includes(itemName.toLowerCase())).length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {stockItems
                    .filter(i => i.name.toLowerCase().includes(itemName.toLowerCase()))
                    .map((item, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => {
                          setItemName(item.name);
                          setPrice(item.purchaseRate || 0);
                          setTotalAmount((item.purchaseRate || 0) * qty);
                          setShowItemSuggestions(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-xs text-violet-600 font-bold">₹{item.purchaseRate}</span>
                        </div>
                        <div className="text-xs text-gray-400">Stock: {item.quantity} {item.unit}</div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            {billingMode === 'amount_based' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => {
                      const newQty = Math.max(1, Number(e.target.value));
                      setQty(newQty);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalAmount || ""}
                    onChange={(e) => setTotalAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-right font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unit Rate (₹)</label>
                  <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-right text-gray-500 font-semibold h-[38px] flex items-center justify-end">
                    ₹ {(Number(totalAmount || 0) / Math.max(1, Number(qty || 1))).toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => {
                      const newQty = Math.max(1, Number(e.target.value));
                      setQty(newQty);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* List of Added Items */}
          {particulars.length > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-[11px] text-left border-collapse bg-gray-50/50">
                <thead>
                  <tr className="bg-gray-100/75 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {particulars.map((item, idx) => (
                    <tr key={idx} className="text-gray-700 hover:bg-white/50 transition-colors">
                      <td className="px-3 py-2 font-semibold text-gray-900 truncate max-w-[120px]">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 text-center">{item.qty}</td>
                      <td className="px-3 py-2 text-right">₹{item.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-bold text-violet-600">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => setParticulars(particulars.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3 bg-gray-50/50 p-4 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">₹ {subTotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Tax (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-12 border border-gray-200 rounded px-1 py-0.5 text-center text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div className="text-right font-medium text-gray-700">
              ₹ {totals.taxAmount.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t border-gray-100 pt-2">
            <span>Total Cost</span>
            <span className="text-violet-600">₹ {totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Amount Paid (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              max={totals.grandTotal}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Math.max(0, Math.min(totals.grandTotal, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm text-right font-bold text-violet-600"
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-semibold bg-violet-50/50 p-3 rounded-lg border border-violet-100">
          <span className="text-gray-600">Balance Pending</span>
          <span className={totals.balance > 0 ? "text-red-600" : "text-green-600"}>
            ₹ {totals.balance.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          className="w-full flex items-center gap-2 justify-center px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md shadow-violet-100 transition-colors cursor-pointer"
        >
          <Save className="size-4" /> Save Purchase
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;
