import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { itemService } from "../../../services/ItemService";
import { ArrowLeft, Package, Edit, ShoppingCart, TrendingUp, DollarSign, Calendar, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const data = await itemService.getItemDetails(id);
            setItemDetails(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch item details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id]);

    const openEditModal = () => {
        reset({
            sellingPrice: itemDetails.item.sellingPrice || 0,
            hsnCode: itemDetails.item.hsnCode || "",
            quantity: itemDetails.item.quantity || 0,
            purchaseRate: itemDetails.item.purchaseRate || 0,
            category: itemDetails.item.category || "General",
        });
        setIsEditModalOpen(true);
    };

    const onEditSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                quantity: Number(data.quantity),
                purchaseRate: Number(data.purchaseRate),
                sellingPrice: Number(data.sellingPrice)
            };
            await itemService.updateItem(id, payload);
            toast.success("Item updated successfully!");
            setIsEditModalOpen(false);
            fetchDetails();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update item");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin size-10 text-blue-500" />
            </div>
        );
    }

    if (!itemDetails?.item) {
        return (
            <div className="p-8 text-center text-gray-500">
                Item not found or an error occurred.
                <button onClick={() => navigate(-1)} className="mt-4 block mx-auto text-blue-500 hover:underline">Go Back</button>
            </div>
        );
    }

    const { item, purchaseHistory, salesHistory, metrics } = itemDetails;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <Toaster />
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/app/items')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeft className="size-5 text-gray-700 dark:text-gray-300" />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {item.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'In Stock' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {item.status}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category: {item.category} | HSN: {item.hsnCode || 'N/A'}</p>
                </div>
                <button onClick={openEditModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Edit className="size-4" />
                    Edit Item
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Stock</p>
                        <Package className="size-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.quantity} <span className="text-base font-normal text-gray-500">{item.unit}</span></p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pricing</p>
                        <DollarSign className="size-5 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Buy: <span className="font-semibold text-gray-900 dark:text-white">₹{item.purchaseRate}</span></span>
                        <span className="text-gray-500">Sell: <span className="font-semibold text-gray-900 dark:text-white">₹{item.sellingPrice}</span></span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchased</p>
                        <ShoppingCart className="size-5 text-purple-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.totalQuantityPurchased} {item.unit}</p>
                    <p className="text-xs text-gray-500 mt-1">₹{metrics.totalValuePurchased} ({metrics.timesPurchased} times)</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sold</p>
                        <TrendingUp className="size-5 text-emerald-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.totalQuantitySold} {item.unit}</p>
                    <p className="text-xs text-gray-500 mt-1">₹{metrics.totalValueSold} ({metrics.timesSold} times)</p>
                </div>
            </div>

            {/* History Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Purchase History */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
                        <ShoppingCart className="size-5 text-gray-500 dark:text-gray-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Purchase History</h3>
                        <span className="ml-auto text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{purchaseHistory.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Vendor</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Qty</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {purchaseHistory.length > 0 ? purchaseHistory.map((p, idx) => {
                                    const details = p.particulars.find(x => x.name === item.name);
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {new Date(p.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                {p.partyName}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                                                +{details?.qty}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                ₹{details?.price}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No purchase history found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales History */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
                        <TrendingUp className="size-5 text-gray-500 dark:text-gray-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Sales History</h3>
                        <span className="ml-auto text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{salesHistory.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Qty</th>
                                    <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {salesHistory.length > 0 ? salesHistory.map((s, idx) => {
                                    const details = s.particulars.find(x => x.name === item.name);
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {new Date(s.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                                                {s.partyName}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                                                -{details?.qty}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                ₹{details?.price}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No sales history found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Item Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit {item.name}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <input {...register("category")} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adjust Quantity</label>
                                <input {...register("quantity")} type="number" min="0" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Rate (₹)</label>
                                <input {...register("purchaseRate")} type="number" step="0.01" min="0" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹)</label>
                                <input {...register("sellingPrice")} type="number" step="0.01" min="0" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HSN Code</label>
                                <input {...register("hsnCode")} type="text" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center gap-2">
                                    {isSubmitting && <Loader2 className="animate-spin size-4" />}
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
