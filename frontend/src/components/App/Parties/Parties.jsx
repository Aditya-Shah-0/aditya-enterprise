import React, { useState, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PartyListSidebar from "./PartyListSidebar";
import PartyDetailsView from "./PartyDetailsView";
import PaymentModal from "../Common/PaymentModal";
import BulkPaymentModal from "../Common/BulkPaymentModal";
import { transactionService } from "../../../services/transactionService";
import { purchaseService } from "../../../services/purchaseService";

const Parties = () => {
  const navigate = useNavigate();
  const { transaction, purchases, owner, refreshTransactions, refreshPurchases, refreshUser } = useAuth();

  // UI Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'customer', 'supplier'
  const [selectedPartyName, setSelectedPartyName] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Bulk Payment Modal State
  const [isBulkPaymentModalOpen, setIsBulkPaymentModalOpen] = useState(false);
  const [bulkPaymentParty, setBulkPaymentParty] = useState(null);

  const handleRecordPayment = (txn) => {
    setSelectedTxn(txn);
    setIsPaymentModalOpen(true);
  };

  const handleRecordBulkPayment = (party) => {
    setBulkPaymentParty(party);
    setIsBulkPaymentModalOpen(true);
  };

  const savePayment = async (paymentData) => {
    if (!selectedTxn) return;
    try {
      if (selectedTxn.txnType === "sale") {
        const response = await transactionService.updateTransaction(selectedTxn._id, paymentData);
        if (response.success || response.transaction) {
          toast.success("Payment recorded successfully");
          await refreshTransactions();
          await refreshUser();
        } else {
          toast.error("Failed to record payment");
        }
      } else if (selectedTxn.txnType === "purchase") {
        const response = await purchaseService.updatePurchase(selectedTxn._id, paymentData);
        if (response.success || response.purchase) {
          toast.success("Payment recorded successfully");
          await refreshPurchases();
          await refreshUser();
        } else {
          toast.error("Failed to record payment");
        }
      }
      setIsPaymentModalOpen(false);
      setSelectedTxn(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to record payment");
    }
  };

  const saveBulkPayment = async (bulkData) => {
    if (!bulkPaymentParty) return;
    try {
      const payload = {
        partyName: bulkPaymentParty.name,
        amount: bulkData.amount,
        paymentMode: bulkData.paymentMode,
        date: bulkData.date,
        type: bulkData.type
      };
      const response = await transactionService.recordBulkPayment(payload);
      if (response.success) {
        toast.success("Bulk payment applied successfully!");
        await refreshTransactions();
        await refreshPurchases();
        await refreshUser();
      } else {
        toast.error("Failed to apply bulk payment");
      }
      setIsBulkPaymentModalOpen(false);
      setBulkPaymentParty(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply bulk payment");
    }
  };

  // Dynamic grouping of parties from Sales and Purchases databases
  const partiesData = useMemo(() => {
    const txns = transaction?.transactions || [];
    const purchaseTxns = purchases?.purchases || [];
    const partiesMap = {};

    // Process Sales Invoices (Customers)
    txns.forEach((txn) => {
      const name = txn.partyName;
      if (!name) return;

      if (!partiesMap[name]) {
        partiesMap[name] = {
          name,
          address: txn.partyAddress || "No Address Provided",
          phone: txn.partyPhone || "",
          gstNumber: "",
          isCustomer: true,
          isSupplier: false,
          sales: [],
          purchases: [],
          totalSales: 0,
          totalPurchases: 0,
          receivable: 0,
          payable: 0
        };
      }

      const party = partiesMap[name];
      party.sales.push(txn);
      party.totalSales += txn.grandTotal || 0;
      party.receivable += txn.balance || 0;
      party.isCustomer = true;
      if (txn.partyAddress && (!party.address || party.address === "No Address Provided")) {
        party.address = txn.partyAddress;
      }
      if (txn.partyPhone && !party.phone) {
        party.phone = txn.partyPhone;
      }
    });

    // Process Purchase Bills (Suppliers)
    purchaseTxns.forEach((pur) => {
      const name = pur.partyName;
      if (!name) return;

      if (!partiesMap[name]) {
        partiesMap[name] = {
          name,
          address: pur.partyAddress || "No Address Provided",
          phone: pur.partyPhone || "",
          gstNumber: pur.gstNumber || "",
          isCustomer: false,
          isSupplier: true,
          sales: [],
          purchases: [],
          totalSales: 0,
          totalPurchases: 0,
          receivable: 0,
          payable: 0
        };
      }

      const party = partiesMap[name];
      party.purchases.push(pur);
      party.totalPurchases += pur.grandTotal || 0;
      party.payable += pur.balance || 0;
      party.isSupplier = true;

      if (pur.partyAddress && (!party.address || party.address === "No Address Provided")) {
        party.address = pur.partyAddress;
      }
      if (pur.partyPhone && !party.phone) {
        party.phone = pur.partyPhone;
      }
      if (pur.gstNumber && !party.gstNumber) {
        party.gstNumber = pur.gstNumber;
      }
    });

    const credits = owner?.partyCredits || [];
    Object.keys(partiesMap).forEach(name => {
      const creditEntry = credits.find(c => c.partyName.toLowerCase() === name.toLowerCase());
      partiesMap[name].advanceBalance = creditEntry ? creditEntry.advanceBalance : 0;
    });

    return Object.values(partiesMap);
  }, [transaction, purchases, owner]);

  // Apply Filter & Search
  const filteredParties = useMemo(() => {
    return partiesData.filter((party) => {
      const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "customer") return party.isCustomer;
      if (activeFilter === "supplier") return party.isSupplier;
      return true;
    });
  }, [partiesData, searchTerm, activeFilter]);

  // Active Selected Party
  const activeParty = useMemo(() => {
    if (!selectedPartyName) return null;
    return partiesData.find((p) => p.name === selectedPartyName) || null;
  }, [partiesData, selectedPartyName]);

  // Itemized traded goods breakdown for the active profile
  const partyItems = useMemo(() => {
    if (!activeParty) return [];
    const itemsMap = {};

    activeParty.sales.forEach((txn) => {
      txn.particulars?.forEach((item) => {
        const name = item.name;
        if (!name) return;
        if (!itemsMap[name]) {
          itemsMap[name] = {
            name,
            qtySold: 0,
            qtyBought: 0,
            salesVal: 0,
            purchasesVal: 0,
            lastTraded: new Date(txn.date)
          };
        }
        const record = itemsMap[name];
        record.qtySold += item.qty || 0;
        record.salesVal += item.amount || 0;

        const itemDate = new Date(txn.date);
        if (itemDate > record.lastTraded) {
          record.lastTraded = itemDate;
        }
      });
    });

    activeParty.purchases.forEach((pur) => {
      pur.particulars?.forEach((item) => {
        const name = item.name;
        if (!name) return;
        if (!itemsMap[name]) {
          itemsMap[name] = {
            name,
            qtySold: 0,
            qtyBought: 0,
            salesVal: 0,
            purchasesVal: 0,
            lastTraded: new Date(pur.date)
          };
        }
        const record = itemsMap[name];
        record.qtyBought += item.qty || 0;
        record.purchasesVal += item.amount || 0;

        const itemDate = new Date(pur.date);
        if (itemDate > record.lastTraded) {
          record.lastTraded = itemDate;
        }
      });
    });

    return Object.values(itemsMap);
  }, [activeParty]);

  // Merged chronological history timeline of invoices and bills
  const partyTimeline = useMemo(() => {
    if (!activeParty) return [];
    const salesMapped = activeParty.sales.map((t) => ({ ...t, txnType: "sale" }));
    const purchasesMapped = activeParty.purchases.map((p) => ({ ...p, txnType: "purchase" }));

    return [...salesMapped, ...purchasesMapped].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [activeParty]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  if (!transaction || !purchases) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin size-10 text-violet-600" />
          <p className="text-gray-500 font-semibold">Gathering business contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-2xl shadow-xs h-[calc(100vh-6rem)] overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      <PartyListSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filteredParties={filteredParties}
        selectedPartyName={selectedPartyName}
        setSelectedPartyName={setSelectedPartyName}
      />

      <PartyDetailsView
        activeParty={activeParty}
        partyItems={partyItems}
        partyTimeline={partyTimeline}
        copyToClipboard={copyToClipboard}
        navigate={navigate}
        onRecordPayment={handleRecordPayment}
        onRecordBulkPayment={handleRecordBulkPayment}
      />

      {selectedTxn && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedTxn(null);
          }}
          onSave={savePayment}
          title={selectedTxn.txnType === "sale" ? "Record Customer Payment" : "Record Supplier Payment"}
          docNo={selectedTxn.invoiceNo}
          partyName={selectedTxn.partyName}
          totalAmount={selectedTxn.grandTotal}
          paidAmount={selectedTxn.paidAmount}
          currentBalance={selectedTxn.grandTotal - selectedTxn.paidAmount}
        />
      )}

      {bulkPaymentParty && (
        <BulkPaymentModal
          isOpen={isBulkPaymentModalOpen}
          onClose={() => {
            setIsBulkPaymentModalOpen(false);
            setBulkPaymentParty(null);
          }}
          onSave={saveBulkPayment}
          partyName={bulkPaymentParty.name}
          outstandingBalance={bulkPaymentParty.isCustomer ? bulkPaymentParty.receivable : bulkPaymentParty.payable}
          type={bulkPaymentParty.isCustomer ? "sale" : "purchase"}
        />
      )}
    </div>
  );
};

export default Parties;
