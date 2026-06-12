import React from "react";
import { Search, Handshake } from "lucide-react";

export const PartyListSidebar = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  filteredParties,
  selectedPartyName,
  setSelectedPartyName
}) => {
  return (
    <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col h-full bg-gray-50/50">
      <div className="p-4 border-b border-gray-200 space-y-3 shrink-0">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Handshake className="size-6 text-violet-600" /> Contacts & Parties
        </h3>

        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-sm">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-1 py-2 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("customer")}
            className={`flex-1 py-2 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === "customer" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveFilter("supplier")}
            className={`flex-1 py-2 rounded-md font-semibold transition-all cursor-pointer ${
              activeFilter === "supplier" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Suppliers
          </button>
        </div>
      </div>

      {/* Party Contacts list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredParties.length > 0 ? (
          filteredParties.map((party) => {
            const isSelected = selectedPartyName === party.name;
            const totalReceivables = party.receivable;
            const totalPayables = party.payable;
            const netOutstanding = totalReceivables - totalPayables;

            return (
              <div
                key={party.name}
                onClick={() => setSelectedPartyName(party.name)}
                className={`p-4 cursor-pointer transition-all border-l-4 ${
                  isSelected
                    ? "bg-violet-50/70 border-violet-600"
                    : "border-transparent hover:bg-gray-100/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 text-base truncate max-w-[170px]">
                    {party.name}
                  </h4>
                  <div className="flex gap-1.5 shrink-0">
                    {party.isCustomer && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Customer
                      </span>
                    )}
                    {party.isSupplier && (
                      <span className="bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Supplier
                      </span>
                    )}
                  </div>
                </div>

                {/* Outstanding balance indicators */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="truncate max-w-[150px] font-medium">{party.address.split(',')[0]}</span>
                  {netOutstanding > 0 ? (
                    <span className="text-emerald-600 font-semibold text-sm">
                      + ₹{netOutstanding.toFixed(2)}
                    </span>
                  ) : netOutstanding < 0 ? (
                    <span className="text-red-600 font-semibold text-sm">
                      - ₹{Math.abs(netOutstanding).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-semibold text-sm">₹0.00</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No business contacts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyListSidebar;
