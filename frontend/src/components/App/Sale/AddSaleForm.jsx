import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, UserRound, Landmark, Save, Sigma, UserPlus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../../Schemas/transactionSchema";
import { Toaster, toast } from "react-hot-toast";
import { transactionService } from "../../../services/transactionService";
import { quotationService } from "../../../services/quotationService";
import ErrorBoundary from "../Common/ErrorBoundary";
import ParticularsTable from "./ParticularsTable";

const AddSaleForm = () => {
  const navigate = useNavigate();
  const { owner, transaction, refreshTransactions } = useAuth();
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const billingMode = owner?.businessSettings?.billingCalculationMode || 'rate_based';

  const [quotations, setQuotations] = useState([]);
  const [quickContacts, setQuickContacts] = useState(() => {
    try {
      const stored = localStorage.getItem("quick_contacts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await quotationService.getQuotations();
        setQuotations(res.quotations || []);
      } catch (err) {
        console.error("Failed to load quotations for suggestions", err);
      }
    };
    fetchQuotes();
  }, []);

  const uniqueCustomers = useMemo(() => {
    const customersMap = new Map();
    const txns = transaction?.transactions || [];
    txns.forEach((txn) => {
      if (txn.partyName && !customersMap.has(txn.partyName)) {
        customersMap.set(txn.partyName, {
          name: txn.partyName,
          address: txn.partyAddress || "",
          phone: txn.partyPhone || "",
        });
      }
    });

    quotations.forEach((q) => {
      if (q.partyName && !customersMap.has(q.partyName)) {
        customersMap.set(q.partyName, {
          name: q.partyName,
          address: q.partyAddress || "",
          phone: q.partyPhone || "",
        });
      } else if (q.partyName && customersMap.has(q.partyName)) {
        const existing = customersMap.get(q.partyName);
        if (!existing.phone && q.partyPhone) existing.phone = q.partyPhone;
        if (!existing.address && q.partyAddress) existing.address = q.partyAddress;
      }
    });

    quickContacts.forEach((c) => {
      if (c.name && !customersMap.has(c.name)) {
        customersMap.set(c.name, {
          name: c.name,
          address: c.address || "",
          phone: c.phone || "",
        });
      } else if (c.name && customersMap.has(c.name)) {
        const existing = customersMap.get(c.name);
        if (!existing.phone && c.phone) existing.phone = c.phone;
        if (!existing.address && c.address) existing.address = c.address;
      }
    });

    return Array.from(customersMap.values());
  }, [transaction, quotations, quickContacts]);

  const business = owner?.businessSettings || {
    bankName: "Demo Bank",
    bankAccountNumber: "000000000000",
    bankIfscCode: "IFSC0000000",
  };
  const invoicePreference = owner?.invoicePreference || {
    customFooterText: "Thank you for your business!",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      partyName: "",
      partyAddress: "",
      partyPhone: "",
      invoiceNo:
        new Date().getFullYear().toString() +
        " - " +
        ((transaction?.transactions?.length || 0) + 1001).toString(),
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      stateOfSupply: "Assam",
      particulars: [],
      discountPercentage: 0,
      taxPercentage: 18,
      paymentMode: "Cash",
      paidAmount: 0,
      term: "Net 3",
      isPaid: false,
      subTotal: 0,
      grandTotal: 0,
    },
  });


  const handleSaveQuickContact = () => {
    const name = watch("partyName");
    const address = watch("partyAddress") || "";
    const phone = watch("partyPhone") || "";

    if (!name?.trim()) {
      toast.error("Enter a party name before saving contact");
      return;
    }

    const saved = localStorage.getItem("quick_contacts");
    let contactsList = saved ? JSON.parse(saved) : [];
    const existingIdx = contactsList.findIndex(c => c.name.toLowerCase() === name.trim().toLowerCase());
    const newContact = { name: name.trim(), address: address.trim(), phone: phone.trim() };

    if (existingIdx > -1) {
      contactsList[existingIdx] = newContact;
      toast.success(`Updated details for contact: ${name}`);
    } else {
      contactsList.push(newContact);
      toast.success(`Saved contact: ${name}`);
    }

    localStorage.setItem("quick_contacts", JSON.stringify(contactsList));
    setQuickContacts(contactsList);
  };

  // PRE-FILL FROM CONVERTED QUOTATION
  useEffect(() => {
    const rawQuote = sessionStorage.getItem("convert_quotation");
    if (rawQuote) {
      try {
        const quote = JSON.parse(rawQuote);
        reset({
          partyName: quote.partyName || "",
          partyAddress: quote.partyAddress || "",
          partyPhone: quote.partyPhone || "",
          invoiceNo:
            new Date().getFullYear().toString() +
            " - " +
            ((transaction?.transactions?.length || 0) + 1001).toString(),
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date().toISOString().split("T")[0],
          stateOfSupply: quote.stateOfSupply || "Assam",
          particulars: quote.particulars || [],
          discountPercentage: quote.discountPercentage || 0,
          taxPercentage: quote.taxPercentage || 18,
          paymentMode: "Cash",
          paidAmount: 0,
          term: quote.term || "Net 3",
          isPaid: false,
          subTotal: Number(quote.subTotal) || 0,
          grandTotal: Number(quote.grandTotal) || 0,
        });
        toast.success("Loaded details from Quotation!");
      } catch (err) {
        console.error("Error parsing convert_quotation", err);
      } finally {
        sessionStorage.removeItem("convert_quotation");
      }
    }
  }, [reset, transaction]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "particulars",
  });

  const particulars = useWatch({ control, name: "particulars" });
  const discountPct = useWatch({ control, name: "discountPercentage" }) || 0;
  const taxPct = useWatch({ control, name: "taxPercentage" }) || 0;
  const paidAmount = useWatch({ control, name: "paidAmount" }) || 0;
  const partyNameValue = watch("partyName");

  const totals = useMemo(() => {
    const subTotal = particulars?.reduce((acc, item) => acc + item.amount, 0) || 0;
    const discountAmount = subTotal * (discountPct / 100);
    const taxAmount = subTotal * (taxPct / 100);
    const grandTotal = subTotal - discountAmount + taxAmount;
    const balance = grandTotal - paidAmount;

    return { subTotal, discountAmount, taxAmount, grandTotal, balance };
  }, [particulars, discountPct, taxPct, paidAmount]);

  const onSubmit = async (data) => {
    try {
      const finalPayload = {
        ...data,
        subTotal: totals.subTotal.toString(),
        grandTotal: totals.grandTotal.toString(),
        balance: totals.balance.toString(),
        isPaid: totals.balance <= 0,
      };
      await transactionService.addTransaction(finalPayload);
      await refreshTransactions();

      toast.success("Sale added successfully");
      reset();
      navigate("/app/sale");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add sale");
    }
  };

  // Global Keyboard Shortcuts (Alt+S or Ctrl+S to save)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.altKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleSubmit, totals]);

  return (
    <div className="h-screen flex flex-col w-full rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="bg-white px-6 py-3 border-b flex items-center gap-3 shrink-0 rounded-t-lg">
        <button
          onClick={() => navigate("/app/sale")}
          className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowBigLeft size={30} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Add Sale</h2>
      </div>

      {/* Main Content Scrollable */}
      <form
        className="flex-1 overflow-auto p-4 bg-gray-50"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Top Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100">
            {/* Party Details */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4 font-extrabold border-b border-gray-400 pb-2">
                <UserRound size={24} className="text-blue-600" />
                <span>Party Details</span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Party Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...register("partyName")}
                      onFocus={() => setShowCustomerSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-semibold"
                      placeholder="Enter party name"
                    />
                    <button
                      type="button"
                      onClick={handleSaveQuickContact}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-gray-600 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
                      title="Save Contact Info for Future Billing"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                  {showCustomerSuggestions && partyNameValue && uniqueCustomers.filter((c) => c.name.toLowerCase().includes(partyNameValue.toLowerCase())).length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {uniqueCustomers
                        .filter((c) => c.name.toLowerCase().includes(partyNameValue.toLowerCase()))
                        .map((customer, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setValue("partyName", customer.name);
                              if (customer.address) setValue("partyAddress", customer.address);
                              if (customer.phone) setValue("partyPhone", customer.phone);
                              setShowCustomerSuggestions(false);
                            }}
                          >
                            <div className="font-semibold">{customer.name}</div>
                            {customer.phone && <div className="text-xs text-gray-500 font-semibold">📞 {customer.phone}</div>}
                            <div className="text-xs text-gray-400 truncate">
                              {customer.address}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  {errors.partyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.partyName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Party Phone Number (WhatsApp/Contact)
                  </label>
                  <input
                    type="text"
                    {...register("partyPhone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    placeholder="Enter phone number (e.g. 9876543210)"
                  />
                  {errors.partyPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.partyPhone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Party Address
                  </label>
                  <textarea
                    rows="2"
                    {...register("partyAddress")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                    placeholder="Enter billing address"
                  />
                  {errors.partyAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.partyAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4 text-black font-extrabold border-b border-gray-400 pb-2">
                <Sigma size={24} className="text-blue-600" />
                <span>Invoice Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    {...register("invoiceNo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter invoice number"
                  />
                  {errors.invoiceNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceNo.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    State of Supply
                  </label>
                  <input
                    type="text"
                    {...register("stateOfSupply")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter state of supply"
                  />
                  {errors.stateOfSupply && (
                    <p className="text-red-500 text-sm mt-1">{errors.stateOfSupply.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Particulars Section */}
          <ErrorBoundary title="Particulars Table Error">
            <ParticularsTable
              fields={fields}
              append={append}
              remove={remove}
              billingMode={billingMode}
            />
          </ErrorBoundary>

          {/* Bottom Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Bank Details */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50 h-full">
              <h3 className="text-black font-extrabold mb-4 border-b border-gray-400 pb-2 flex items-center gap-2">
                <Landmark size={24} className="text-blue-600" /> Bank Details
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Select Bank
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option id="bank">
                      {business.bankName} - **** {business.bankAccountNumber.slice(-4)}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    IFSC Code (readonly)
                  </label>
                  <input
                    value={business.bankIfscCode}
                    readOnly
                    type="text"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Terms</label>
                  <select
                    {...register("term")}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option id="net3">Net 3</option>
                    <option id="net15">Net 15</option>
                    <option id="net30">Net 30</option>
                  </select>
                  {errors.term && <p className="text-red-500 text-sm mt-1">{errors.term.message}</p>}
                </div>
              </div>
              <div>
                <div className="mb-1 text-sm font-semibold text-gray-600">Terms & Conditions</div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  defaultValue={invoicePreference.customFooterText}
                />
              </div>
            </div>

            {/* Calculations */}
            <div className="border border-gray-400 rounded-lg p-5 bg-white shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">₹ {totals.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span>
                    Tax (%)
                    <input
                      type="number"
                      {...register("taxPercentage", { valueAsNumber: true })}
                      className="ml-2 w-16 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center remove-arrow"
                    />
                    {errors.taxPercentage && (
                      <p className="text-red-500 text-sm">{errors.taxPercentage.message}</p>
                    )}
                  </span>
                  <span className="font-semibold text-gray-700">₹ {totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span>
                    Discount (%)
                    <input
                      type="number"
                      {...register("discountPercentage", { valueAsNumber: true })}
                      className="ml-2 w-16 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center remove-arrow"
                    />
                    {errors.discountPercentage && (
                      <p className="text-red-500 text-sm">{errors.discountPercentage.message}</p>
                    )}
                  </span>
                  <span className="font-semibold text-gray-700">₹ {totals.discountAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold">Paid</span>
                  <div className="flex gap-2">
                    <select
                      {...register("paymentMode")}
                      className="border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center remove-arrow"
                    >
                      <option id="cash">Cash</option>
                      <option id="bankTransfer">Bank Transfer</option>
                      <option id="onlinePayment">Online Payment</option>
                      <option id="cheque">Cheque</option>
                      <option id="other">Other</option>
                    </select>
                    {errors.paymentMode && (
                      <p className="text-red-500 text-sm">{errors.paymentMode.message}</p>
                    )}
                    <input
                      type="number"
                      {...register("paidAmount", { valueAsNumber: true })}
                      className="w-24 border border-gray-300 rounded text-right font-bold text-blue-600 remove-arrow px-2"
                    />
                    {errors.paidAmount && (
                      <p className="text-red-500 text-sm">{errors.paidAmount.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center font-bold">
                  <span>Balance</span>
                  <span className={totals.balance > 0 ? "text-red-500" : "text-green-500"}>
                    ₹ {totals.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center gap-2 justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 cursor-pointer"
                  title="Press Ctrl+S or Alt+S to save"
                >
                  <Save /> Save & Print <span className="text-xs bg-blue-700 px-1.5 py-0.5 rounded opacity-80 font-normal ml-1">Ctrl + S</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSaleForm;
