import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { quotationService } from "../../../services/quotationService";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "../Common/ErrorBoundary";
import QuotationStatsCards from "./QuotationStatsCards";
import RecentQuotationsTable from "./RecentQuotationsTable";

const QuotationDashboard = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load quotations on mount
  const getQuotations = async () => {
    try {
      setIsLoading(true);
      const res = await quotationService.getQuotations();
      setQuotations(res.quotations || []);
    } catch (error) {
      console.error("Failed to load quotations", error);
      toast.error("Failed to load quotations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuotations();
  }, []);

  // Filtered quotations computed live
  const filteredQuotations = useMemo(() => {
    if (!searchQuery.trim()) return quotations;

    const query = searchQuery.toLowerCase();
    return quotations.filter(
      (q) =>
        q.partyName?.toLowerCase().includes(query) ||
        q.quotationNo?.toLowerCase().includes(query) ||
        q.date?.split("T")[0].includes(query) ||
        q.status?.toLowerCase().includes(query)
    );
  }, [quotations, searchQuery]);

  // Stats computed live
  const stats = useMemo(() => {
    return quotations.reduce(
      (acc, curr) => {
        const isAccepted = curr.status === "Accepted" || curr.status === "Invoiced";
        return {
          totalCount: acc.totalCount + 1,
          totalAmount: acc.totalAmount + (curr.grandTotal || 0),
          acceptedAmount: acc.acceptedAmount + (isAccepted ? (curr.grandTotal || 0) : 0),
        };
      },
      { totalCount: 0, totalAmount: 0, acceptedAmount: 0 }
    );
  }, [quotations]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await quotationService.updateQuotationStatus(id, newStatus);
      if (response.success || response.quotation) {
        setQuotations((prev) =>
          prev.map((q) => (q._id === id ? response.quotation : q))
        );
        toast.success(`Quotation marked as ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quotation status");
    }
  };

  const handleDeleteQuotation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) {
      return;
    }
    try {
      const response = await quotationService.deleteQuotation(id);
      if (response.success) {
        setQuotations((prev) => prev.filter((q) => q._id !== id));
        toast.success("Quotation deleted successfully");
      } else {
        toast.error("Failed to delete quotation");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete quotation");
    }
  };

  const handleConvertToInvoice = (quote) => {
    sessionStorage.setItem("convert_quotation", JSON.stringify(quote));
    toast.success("Quotation details loaded! Redirecting to Sale form...");
    setTimeout(() => {
      navigate("/app/sale/addsale");
    }, 800);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 rounded-2xl">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-black">Estimations / Quotations</h2>

      <ErrorBoundary title="Quotation Stats Cards Error">
        <QuotationStatsCards
          totalCount={stats.totalCount}
          totalAmount={stats.totalAmount}
          acceptedAmount={stats.acceptedAmount}
        />
      </ErrorBoundary>

      <ErrorBoundary title="Quotations Table Error">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
            <span className="text-sm font-semibold text-gray-500">Loading quotations...</span>
          </div>
        ) : (
          <RecentQuotationsTable
            filteredQuotations={filteredQuotations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onStatusChange={handleStatusChange}
            onDeleteQuotation={handleDeleteQuotation}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default QuotationDashboard;
