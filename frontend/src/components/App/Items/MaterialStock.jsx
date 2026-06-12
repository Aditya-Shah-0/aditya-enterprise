import React, { useState, useEffect, useMemo } from "react";
import { Package, Plus } from "lucide-react";
import { itemService } from "../../../services/ItemService";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "../Common/ErrorBoundary";
import StockStats from "./StockStats";
import StockTable from "./StockTable";
import ItemAddModal from "./ItemAddModal";
import ItemEditModal from "./ItemEditModal";

const MaterialStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getItems();
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch stock items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await itemService.deleteItem(id);
        toast.success("Item deleted successfully");
        fetchItems();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete item");
      }
    }
  };

  // Derive filtered items list
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  // Derive status counts
  const { lowStockCount, outOfStockCount } = useMemo(() => {
    const lowStock = items.filter((i) => i.status === "Low Stock").length;
    const outOfStock = items.filter((i) => i.status === "Out of Stock").length;
    return { lowStockCount: lowStock, outOfStockCount: outOfStock };
  }, [items]);

  return (
    <div>
      <Toaster />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <Package className="size-6 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Material Stock</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="size-4" />
          Add New Item
        </button>
      </div>

      <ErrorBoundary title="Stock Statistics Error">
        <StockStats
          itemsCount={items.length}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
        />
      </ErrorBoundary>

      <ErrorBoundary title="Stock Table List Error">
        <StockTable
          filteredItems={filteredItems}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEditItem={openEditModal}
          onDeleteItem={handleDelete}
        />
      </ErrorBoundary>

      <ErrorBoundary title="Add Item Dialog Error">
        <ItemAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchItems}
        />
      </ErrorBoundary>

      <ErrorBoundary title="Edit Item Dialog Error">
        <ItemEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          editingItem={editingItem}
          onSuccess={fetchItems}
          showCategory={false}
        />
      </ErrorBoundary>
    </div>
  );
};

export default MaterialStock;