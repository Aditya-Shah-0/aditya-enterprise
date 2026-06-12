import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigLeft, UserRound, Landmark, Save, Sigma, UserPlus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quotationSchema } from "../../../Schemas/quotationSchema";
import { Toaster, toast } from "react-hot-toast";
import { quotationService } from "../../../services/quotationService";
import ErrorBoundary from "../Common/ErrorBoundary";
import QuotationParticularsTable from "./QuotationParticularsTable";

const CreateQuotationForm = () => {
  const navigate = useNavigate();
  const { owner, transaction } = useAuth();
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
    customFooterText: "This is a computer-generated estimation/quotation.",
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
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      partyName: "",
      partyAddress: "",
      partyPhone: "",
      quotationNo: "EST-" + new Date().getFullYear().toString() + "-1001",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // valid for 15 days
      stateOfSupply: "Assam",
      particulars: [],
      discountPercentage: 0,
      taxPercentage: 18,
      term: "Net 15",
      status: "Draft",
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

  // Load sequential quote number
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await quotationService.getQuotations();
        const count = res.quotations?.length || 0;
        setValue("quotationNo", "EST-" + new Date().getFullYear().toString() + "-" + (count + 1001).toString());
      } catch (err) {
        console.error(err);
      }
    };
    fetchCount();
  }, [setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "particulars",
  });

  const particulars = useWatch({ control, name: "particulars" });
  const discountPct = useWatch({ control, name: "discountPercentage" }) || 0;
  const taxPct = useWatch({ control, name: "taxPercentage" }) || 0;
  const partyNameValue = watch("partyName");

  const totals = useMemo(() => {
    const subTotal = particulars?.reduce((acc, item) => acc + item.amount, 0) || 0;
    const discountAmount = subTotal * (discountPct / 100);
    const taxAmount = subTotal * (taxPct / 100);
    const grandTotal = subTotal - discountAmount + taxAmount;

    return { subTotal, discountAmount, taxAmount, grandTotal };
  }, [particulars, discountPct, taxPct]);

  const onSubmit = async (data) => {
    try {
      const finalPayload = {
        ...data,
        subTotal: totals.subTotal.toString(),
        grandTotal: totals.grandTotal.toString(),
        customFooterText: document.getElementById("footerText")?.value || invoicePreference.customFooterText
      };
      await quotationService.addQuotation(finalPayload);

      toast.success("Quotation saved successfully");
      reset();
      navigate("/app/quotation");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add quotation");
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
    <div className="h-screen flex flex-col w-full rounded-lg bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="bg-white px-6 py-3 border-b flex items-center justify-between shrink-0 rounded-t-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/app/quotation")}
            className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
          >
            <ArrowBigLeft size={30} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Create Quotation / Estimation</h2>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <form
        className="flex-1 overflow-auto p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Top Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100">
            {/* Party Details */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4 font-extrabold border-b border-gray-400 pb-2 text-black">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none text-gray-700"
                    placeholder="Enter billing address"
                  />
                  {errors.partyAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.partyAddress.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quotation Details */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-4 font-extrabold border-b border-gray-400 pb-2 text-black">
                <Sigma size={24} className="text-blue-600" />
                <span>Quotation Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Quotation No
                  </label>
                  <input
                    type="text"
                    {...register("quotationNo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-semibold"
                    placeholder="Enter quotation number"
                  />
                  {errors.quotationNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.quotationNo.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Valid Until</label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
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
            <QuotationParticularsTable
              fields={fields}
              append={append}
              remove={remove}
              billingMode={billingMode}
            />
          </ErrorBoundary>

          {/* Bottom Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: T&C */}
            <div className="border border-gray-400 rounded-lg p-5 bg-gray-50/50 h-full">
              <h3 className="text-black font-extrabold mb-4 border-b border-gray-400 pb-2 flex items-center gap-2">
                <Landmark size={24} className="text-blue-600" /> Print Details & Terms
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Validity Term</label>
                  <select
                    {...register("term")}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                  >
                    <option value="Net 3">Valid 3 Days</option>
                    <option value="Net 15">Valid 15 Days</option>
                    <option value="Net 30">Valid 30 Days</option>
                  </select>
                </div>
                <div>
                  <div className="mb-1 text-sm font-semibold text-gray-600">Terms & Conditions / Notes</div>
                  <textarea
                    id="footerText"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 resize-none"
                    defaultValue={invoicePreference.customFooterText}
                  />
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="border border-gray-400 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
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
                  </span>
                  <span className="font-semibold text-gray-700">₹ {totals.discountAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                  <span>Estimated Total</span>
                  <span className="text-blue-600">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center gap-2 justify-center px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 cursor-pointer transition-all"
                  title="Press Ctrl+S or Alt+S to save"
                >
                  <Save className="size-5" /> Save Quotation <span className="text-xs bg-blue-700 px-1.5 py-0.5 rounded opacity-80 font-normal ml-1">Ctrl + S</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuotationForm;
