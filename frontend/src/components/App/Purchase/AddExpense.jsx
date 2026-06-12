import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { purchaseService } from "../../../services/purchaseService";
import toast, { Toaster } from "react-hot-toast";
import PaymentModal from "../Common/PaymentModal";
import ErrorBoundary from "../Common/ErrorBoundary";
import StatsCards from "./StatsCards";
import RecentPurchasesTable from "./RecentPurchasesTable";
import PurchaseForm from "./PurchaseForm";

const AddExpense = () => {
  const navigate = useNavigate();
  const { purchases, refreshPurchases, owner } = useAuth();

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const billingMode = owner?.businessSettings?.billingCalculationMode || 'rate_based';

  const transactions = useMemo(() => {
    return purchases?.purchases || [];
  }, [purchases]);

  const uniqueVendors = useMemo(() => {
    const vendorsMap = new Map();
    transactions.forEach(txn => {
      if (txn.partyName && !vendorsMap.has(txn.partyName)) {
        vendorsMap.set(txn.partyName, {
          name: txn.partyName,
          address: txn.partyAddress || "",
          gst: txn.gstNumber || "",
          phone: txn.partyPhone || ""
        });
      }
    });
    return Array.from(vendorsMap.values());
  }, [transactions]);

  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => ({
        totalPurchases: acc.totalPurchases + (curr.grandTotal || 0),
        totalPaid: acc.totalPaid + (curr.paidAmount || 0),
        totalPending: acc.totalPending + ((curr.grandTotal || 0) - (curr.paidAmount || 0)),
      }),
      { totalPurchases: 0, totalPaid: 0, totalPending: 0 }
    );
  }, [transactions]);

  const handleMarkAsPaid = async (id, paymentData = null) => {
    try {
      await purchaseService.updatePurchase(id, paymentData);
      toast.success(paymentData ? "Payment recorded successfully" : "Purchase marked as Paid");
      await refreshPurchases();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleRecordPayment = (txn) => {
    setSelectedPurchase(txn);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col w-full rounded-lg">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="bg-white px-6 py-3 border-b flex items-center gap-3 shrink-0 rounded-t-lg">
        <button
          onClick={() => navigate("/app/dashboard")}
          className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Purchases & Expenses</h2>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Form Card (5 cols) */}
          <div className="lg:col-span-5 self-start">
            <ErrorBoundary title="Purchase Form Error">
              <PurchaseForm
                uniqueVendors={uniqueVendors}
                billingMode={billingMode}
                transactionsCount={transactions.length}
                onSuccess={refreshPurchases}
              />
            </ErrorBoundary>
          </div>

          {/* Right: Stats & Recent Purchases (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ErrorBoundary title="Stats Cards Error">
              <StatsCards stats={stats} />
            </ErrorBoundary>

            <ErrorBoundary title="Recent Transactions Error">
              <RecentPurchasesTable
                transactions={transactions}
                onRecordPayment={handleRecordPayment}
              />
            </ErrorBoundary>
          </div>

        </div>
      </div>

      {selectedPurchase && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPurchase(null);
          }}
          onSave={(data) => handleMarkAsPaid(selectedPurchase._id, data)}
          title="Record Vendor Payment"
          docNo={selectedPurchase.invoiceNo}
          partyName={selectedPurchase.partyName}
          totalAmount={selectedPurchase.grandTotal}
          paidAmount={selectedPurchase.paidAmount}
          currentBalance={selectedPurchase.grandTotal - selectedPurchase.paidAmount}
        />
      )}
    </div>
  );
};

export default AddExpense;
