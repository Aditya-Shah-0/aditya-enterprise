import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeft, Save, Plus, ShoppingCart, User, Receipt, Trash2, Tag, Sigma } from "lucide-react";
import { purchaseService } from "../../../services/purchaseService";
import { itemService } from "../../../services/ItemService";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "../Common/ErrorBoundary";

const EditPurchaseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { purchases, refreshPurchases, owner } = useAuth();

  const purchase = purchases?.purchases?.find((item) => item._id === id);

  // Form States
  const [partyName, setPartyName] = useState("");
  const [partyAddress, setPartyAddress] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

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

  // Derive unique vendors from existing purchases
  const uniqueVendors = useMemo(() => {
    const vendorsMap = new Map();
    const purchaseTxns = purchases?.purchases || [];
    purchaseTxns.forEach((p) => {
      if (p.partyName && !vendorsMap.has(p.partyName)) {
        vendorsMap.set(p.partyName, {
          name: p.partyName,
          gst: p.gstNumber || "",
          address: p.partyAddress || "",
          phone: p.partyPhone || "",
        });
      }
    });
    return Array.from(vendorsMap.values());
  }, [purchases]);

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

  // Pre-fill form when purchase data loads
  useEffect(() => {
    if (purchase) {
      setPartyName(purchase.partyName || "");
      setPartyAddress(purchase.partyAddress || "");
      setPartyPhone(purchase.partyPhone || "");
      setGstNumber(purchase.gstNumber || "");
      setInvoiceNo(purchase.invoiceNo || "");
      setDate(purchase.date ? purchase.date.split("T")[0] : new Date().toISOString().split("T")[0]);
      setDueDate(purchase.dueDate ? purchase.dueDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setParticulars(purchase.particulars || []);
      setDiscountPercentage(purchase.discountPercentage || 0);
      setTaxPercentage(purchase.taxPercentage || 18);
      setPaymentMode(purchase.paymentMode || "Cash");
      setPaidAmount(purchase.paidAmount || 0);
    }
  }, [purchase]);

  // Derived values
  const billingMode = purchase?.billingCalculationMode || "rate_based";

  const invoicePreference = owner?.invoicePreference || {
    customFooterText: "Thank you for your business!",
  };

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
      qty: Number(qty),
      price: Number(itemPrice),
      amount: Number(itemAmount),
      description: ""
    };

    setParticulars([...particulars, newItem]);
    setItemName("");
    setQty(1);
    setPrice(0);
    setTotalAmount(0);
  };

  const handleRemoveItem = (index) => {
    setParticulars(particulars.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partyName.trim()) {
      toast.error("Supplier/Vendor name is required");
      return;
    }

    let finalParticulars = [...particulars];
    if (itemName.trim()) {
      let itemPrice = price;
      let itemAmount = qty * price;
      if (billingMode === 'amount_based') {
        itemPrice = totalAmount / qty;
        itemAmount = totalAmount;
      }
      finalParticulars.push({
        name: itemName.trim(),
        qty: Number(qty),
        price: Number(itemPrice),
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
      await purchaseService.modifyPurchase(id, payload);
      await refreshPurchases();
      toast.success("Purchase bill updated successfully");
      navigate(`/app/purchase/view/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update purchase bill");
    }
  };

  // Keyboard Shortcuts (Alt+A to add item, Ctrl+S to save)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleAddItem();
      } else if ((e.ctrlKey || e.altKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit(e);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [itemName, qty, price, totalAmount, particulars, partyName, totals]);

  return (
    <div className="h-screen flex flex-col w-full rounded-lg text-black bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="bg-white px-6 py-3 border-b flex items-center gap-3 shrink-0 rounded-t-lg">
        <button
          type="button"
          onClick={() => navigate(`/app/purchase/view/${id}`)}
          className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowBigLeft size={30} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Edit Purchase Bill: {purchase?.invoiceNo || ""}</h2>
      </div>

      {/* Main Content Scrollable */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">

          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            {/* Vendor Details */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <h3 className="font-extrabold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                <User className="size-5 text-violet-600" /> Vendor Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Vendor / Party Name
                  </label>
                  <div className="relative">
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm font-semibold"
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
                    Phone Number (Optional)
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
            </div>

            {/* Bill Details */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 space-y-4">
              <h3 className="font-extrabold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Receipt className="size-5 text-violet-600" /> Bill Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Bill No (Locked)
                  </label>
                  <input
                    type="text"
                    value={invoiceNo}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none bg-gray-100 text-gray-500 font-semibold cursor-not-allowed text-sm"
                    title="Bill numbers are read-only locked once created."
                  />
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
            </div>
          </div>

          {/* Particulars grid list */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/20">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Details</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-lg border border-violet-200/50 transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Item <span className="text-[10px] font-normal opacity-85 ml-1">Alt+A</span>
              </button>
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
              <div className="relative md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Item / Material Name</label>
                <input
                  type="text"
                  placeholder="Material name"
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
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 cursor-pointer border-b border-gray-50 last:border-0"
                          onClick={() => {
                            setItemName(item.name);
                            if (billingMode === 'rate_based') {
                              setPrice(item.purchaseRate || 0);
                            }
                            setShowItemSuggestions(false);
                          }}
                        >
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-xs text-gray-400">Stock: {item.quantity} | Rate: ₹ {item.purchaseRate}</div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm font-bold text-center"
                />
              </div>

              {billingMode === 'rate_based' ? (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm font-semibold text-right"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm font-semibold text-right"
                  />
                </div>
              )}
            </div>

            {/* List Particulars Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-xs tracking-wider uppercase">
                    <th className="px-4 py-2.5">Item Name</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Unit Rate (₹)</th>
                    <th className="px-4 py-2.5 text-right">Total (₹)</th>
                    <th className="px-4 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold">
                  {particulars.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-right">{(item.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-950">{(item.amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {particulars.length === 0 && !itemName && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-400 font-medium">
                        No items added to the particulars list yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section with calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

            {/* Calculation summary details */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Tag className="size-5 text-violet-600" /> Terms & Conditions
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Custom Terms / Footer Text
                </label>
                <textarea
                  rows="3"
                  defaultValue={invoicePreference.customFooterText} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
                />
              </div>
            </div>

            {/* Arithmetical Totals */}
            <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-xs text-sm space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">₹ {subTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Discount (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-center font-semibold bg-white"
                  />
                  <span className="font-bold text-gray-900 w-16 text-right">₹ {totals.discountAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>GST Tax (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-center font-semibold bg-white"
                  />
                  <span className="font-bold text-gray-900 w-16 text-right">₹ {totals.taxAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-base">
                <span>Total Amount:</span>
                <span className="text-violet-650">₹ {totals.grandTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-gray-600">
                <span>Paid Outward:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded bg-white text-xs font-semibold"
                  >
                    <option id="cash">Cash</option>
                    <option id="bankTransfer">Bank Transfer</option>
                    <option id="onlinePayment">Online Payment</option>
                    <option id="cheque">Cheque</option>
                    <option id="other">Other</option>
                  </select>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-right font-bold text-violet-600 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center font-bold border-t border-gray-100 pt-2">
                <span>Outstanding Balance:</span>
                <span className={totals.balance > 0 ? "text-red-500" : "text-emerald-500"}>
                  ₹ {totals.balance.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <Save className="size-4" /> Save Changes <span className="text-[10px] font-normal opacity-80 bg-violet-750 px-1.5 py-0.5 rounded">Ctrl + S</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPurchaseForm;
