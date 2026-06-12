import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { itemService } from "../../../services/ItemService";
import toast from "react-hot-toast";

const ItemEditModal = ({
  isOpen,
  onClose,
  editingItem,
  onSuccess,
  showCategory = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Reset form with editingItem fields when it changes
  useEffect(() => {
    if (editingItem) {
      reset({
        sellingPrice: editingItem.sellingPrice || 0,
        hsnCode: editingItem.hsnCode || "",
        quantity: editingItem.quantity || 0,
        purchaseRate: editingItem.purchaseRate || 0,
        category: editingItem.category || "General",
      });
    }
  }, [editingItem, reset]);

  const onEditSubmit = async (data) => {
    if (!editingItem?._id) return;
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity),
        purchaseRate: Number(data.purchaseRate),
        sellingPrice: Number(data.sellingPrice),
      };
      await itemService.updateItem(editingItem._id, payload);
      toast.success("Item updated successfully!");
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Edit {editingItem?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
          {showCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                {...register("category")}
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Adjust Quantity
            </label>
            <input
              {...register("quantity")}
              type="number"
              min="0"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purchase Rate (₹)
            </label>
            <input
              {...register("purchaseRate")}
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selling Price (₹)
            </label>
            <input
              {...register("sellingPrice")}
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              HSN Code
            </label>
            <input
              {...register("hsnCode")}
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="animate-spin size-4" />}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEditModal;
