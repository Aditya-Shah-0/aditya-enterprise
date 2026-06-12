import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { transactionService } from "../../../services/transactionService";
import toast, { Toaster } from "react-hot-toast";
import PaymentModal from "../Common/PaymentModal";
import ErrorBoundary from "../Common/ErrorBoundary";
import SaleStatsCards from "./SaleStatsCards";
import RecentSalesTable from "./RecentSalesTable";

const SaleDashboard = () => {
  const { transaction, refreshTransactions } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filtered transactions computed live
  const filteredTransactions = useMemo(() => {
    const reversed = [...transactions].reverse();
    if (!searchQuery.trim()) return reversed;

    const query = searchQuery.toLowerCase();
    return reversed.filter(
      (t) =>
        t.partyName?.toLowerCase().includes(query) ||
        t.invoiceNo?.toLowerCase().includes(query) ||
        t.date?.split("T")[0].includes(query)
    );
  }, [transactions, searchQuery]);

  // Stats computed live
  const { totalPaid, totalUnpaid, totalSales } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => ({
        totalPaid: acc.totalPaid + (curr.paidAmount || 0),
        totalUnpaid: acc.totalUnpaid + ((curr.grandTotal || 0) - (curr.paidAmount || 0)),
        totalSales: acc.totalSales + (curr.grandTotal || 0),
      }),
      { totalPaid: 0, totalUnpaid: 0, totalSales: 0 }
    );
  }, [transactions]);

  // Load transactions on mount and when auth-state sync is triggered
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await transactionService.getTransactions();
        setTransactions(res.transactions || []);
      } catch (error) {
        console.error("Failed to load transactions", error);
        toast.error("Failed to load transactions");
      }
    };
    getTransactions();
  }, [transaction]);

  const updateTransaction = async (id, paymentData = null) => {
    try {
      const response = await transactionService.updateTransaction(id, paymentData);
      if (response.success || response.transaction) {
        setTransactions((prev) =>
          prev.map((t) => (t._id === id ? response.transaction : t))
        );
        toast.success(paymentData ? "Payment recorded successfully" : "Transaction marked as Paid");
        await refreshTransactions();
      } else {
        toast.error("Failed to update transaction");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
    }
  };

  const handleRecordPayment = (txn) => {
    setSelectedTxn(txn);
    setIsPaymentModalOpen(true);
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-black">Sales</h2>

      <ErrorBoundary title="Sales Stats Cards Error">
        <SaleStatsCards
          totalPaid={totalPaid}
          totalUnpaid={totalUnpaid}
          totalSales={totalSales}
        />
      </ErrorBoundary>

      <ErrorBoundary title="Sales Ledger Error">
        <RecentSalesTable
          filteredTransactions={filteredTransactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRecordPayment={handleRecordPayment}
        />
      </ErrorBoundary>

      {selectedTxn && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedTxn(null);
          }}
          onSave={(data) => updateTransaction(selectedTxn._id, data)}
          title="Record Customer Payment"
          docNo={selectedTxn.invoiceNo}
          partyName={selectedTxn.partyName}
          totalAmount={selectedTxn.grandTotal}
          paidAmount={selectedTxn.paidAmount}
          currentBalance={selectedTxn.grandTotal - selectedTxn.paidAmount}
        />
      )}
    </div>
  );
};

export default SaleDashboard;
