import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollText, Eye, ArrowRightLeft, Calendar, Search, Loader2, AlertCircle } from "lucide-react";
import { quotationService } from "../../../services/quotationService";
import toast from "react-hot-toast";

export const PendingQuotesWidget = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const res = await quotationService.getQuotations();
        // Filter out quotations that have already been converted to invoices
        const pending = (res.quotations || []).filter((q) => q.status !== "Invoiced");
        setQuotations(pending);
      } catch (error) {
        console.error("Failed to fetch pending quotations", error);
        toast.error("Failed to load pending quotations");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const handleConvert = (quote) => {
    sessionStorage.setItem("convert_quotation", JSON.stringify(quote));
    toast.success("Loaded quote details! Opening invoice form...");
    setTimeout(() => {
      navigate("/app/sale/addsale");
    }, 800);
  };

  const filteredQuotes = quotations.filter(
    (q) =>
      q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.partyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (dueDateStr) => {
    if (!dueDateStr) return false;
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[400px] text-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <ScrollText className="size-5 text-purple-650" />
          <h3 className="text-lg font-bold">Pending Quotations</h3>
          {quotations.length > 0 && (
            <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-100">
              {quotations.length}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-white"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full py-12">
            <Loader2 className="animate-spin size-6 text-purple-650" />
          </div>
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => {
            const expired = isExpired(quote.dueDate);
            return (
              <div
                key={quote._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-750 bg-gray-50/50 dark:bg-gray-800/50 group hover:border-purple-200 dark:hover:border-purple-900 transition-all"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {quote.quotationNo}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold truncate max-w-[150px]">
                      {quote.partyName}
                    </span>
                    {expired && (
                      <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 font-bold rounded border border-red-100">
                        <AlertCircle className="size-3" /> Expired
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span>Total: <span className="font-bold text-gray-800 dark:text-gray-200">₹ {(quote.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-gray-400" />
                      Valid: {quote.dueDate ? quote.dueDate.split("T")[0] : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/app/quotation/view/${quote._id}`)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                    title="View Quotation"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    onClick={() => handleConvert(quote)}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2.5 py-1.5 font-bold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
                    title="Convert to Invoice"
                  >
                    <ArrowRightLeft className="size-3.5" />
                    <span>Convert</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
            <ScrollText className="size-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              No pending quotations
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              Create a quotation to track client estimates here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingQuotesWidget;
