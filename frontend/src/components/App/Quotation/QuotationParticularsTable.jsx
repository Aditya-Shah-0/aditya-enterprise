import React, { useState, useEffect, useRef } from "react";
import { ListOrdered, Trash2, Plus, Save, X } from "lucide-react";
import { itemService } from "../../../services/ItemService";
import toast from "react-hot-toast";

const QuotationParticularsTable = ({ fields, append, remove, billingMode }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    qty: 1,
    price: 0,
    totalAmount: 0,
  });
  const [stockItems, setStockItems] = useState([]);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();
        setStockItems(data.items || []);
      } catch (error) {
        console.error("Failed to fetch stock items", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  const handleSaveItem = () => {
    if (!newItem.name.trim()) {
      toast.error("Item name is required");
      nameInputRef.current?.focus();
      return;
    }
    if (newItem.qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (billingMode === "amount_based") {
      if (newItem.totalAmount < 0) {
        toast.error("Total amount cannot be negative");
        return;
      }
      const computedPrice = Number(newItem.totalAmount) / Number(newItem.qty);
      append({
        name: newItem.name.trim(),
        description: newItem.description.trim(),
        qty: newItem.qty,
        price: computedPrice,
        amount: Number(newItem.totalAmount),
      });
    } else {
      if (newItem.price < 0) {
        toast.error("Price cannot be negative");
        return;
      }
      append({
        name: newItem.name.trim(),
        description: newItem.description.trim(),
        qty: newItem.qty,
        price: newItem.price,
        amount: newItem.qty * newItem.price,
      });
    }

    setNewItem({ name: "", description: "", qty: 1, price: 0, totalAmount: 0 });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewItem({ name: "", description: "", qty: 1, price: 0, totalAmount: 0 });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveItem();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdding(true);
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 50);
      }
      if (e.key === "Escape" && isAdding) {
        e.preventDefault();
        handleCancelAdd();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isAdding]);

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <ListOrdered size={24} className="text-blue-600" /> Particulars
        </h3>
        {isAdding ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveItem}
              className="flex items-center gap-1 text-bold text-white cursor-pointer hover:bg-green-700 bg-green-600 px-3 py-2 rounded font-medium text-sm transition-colors"
            >
              <Save size={16} /> Save Item
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="flex items-center gap-1 text-bold text-gray-700 cursor-pointer hover:bg-gray-200 bg-gray-100 border border-gray-300 px-3 py-2 rounded font-medium text-sm transition-colors"
              title="Press Esc to cancel"
            >
              <X size={16} /> Cancel <kbd className="text-[10px] bg-gray-200 px-1 py-0.5 rounded opacity-80 border border-gray-350 ml-1">Esc</kbd>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddClick}
            className="flex items-center gap-1 text-extrabold text-white cursor-pointer hover:text-black bg-blue-800 hover:bg-blue-500 px-2 py-2 rounded font-medium"
            title="Press Alt+A to add item"
          >
            <Plus size={16} color="white" /> Add Item <kbd className="text-[10px] bg-blue-900 px-1 py-0.5 rounded opacity-80 border border-blue-950 ml-1">Alt + A</kbd>
          </button>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Price</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </td>
                <td className="px-4 py-3 text-center">{item.qty}</td>
                <td className="px-4 py-3 text-center">₹ {(item.price || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-center font-medium">
                  ₹ {(item.qty * item.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}

            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className="px-4 py-3 text-center font-bold text-blue-600">
                  {fields.length + 1}
                </td>
                <td className="px-4 py-3 space-y-1 relative">
                  <input
                    ref={nameInputRef}
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => {
                      setNewItem({ ...newItem, name: e.target.value });
                      setShowItemSuggestions(true);
                    }}
                    onFocus={() => setShowItemSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowItemSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                  />
                  {showItemSuggestions && newItem.name && stockItems.filter(i => i.name.toLowerCase().includes(newItem.name.toLowerCase())).length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {stockItems
                        .filter((i) => i.name.toLowerCase().includes(newItem.name.toLowerCase()))
                        .map((item, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setNewItem({
                                ...newItem,
                                name: item.name,
                                description: item.category || "",
                                price: item.sellingPrice || 0,
                                totalAmount: (item.sellingPrice || 0) * (newItem.qty || 1),
                              });
                              setShowItemSuggestions(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-xs text-blue-600 font-bold">
                                ₹{item.sellingPrice}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Stock: {item.quantity} {item.unit}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={newItem.qty}
                    onChange={(e) =>
                      setNewItem({ ...newItem, qty: Math.max(1, Number(e.target.value)) })
                    }
                    onKeyDown={handleKeyDown}
                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-center text-sm"
                  />
                  {(() => {
                    const matched = stockItems.find(
                      (i) => i.name.toLowerCase() === newItem.name.trim().toLowerCase()
                    );
                    if (matched && newItem.qty > matched.quantity) {
                      return (
                        <p className="text-[10px] text-red-500 font-semibold mt-1 leading-none w-20 mx-auto">
                          ⚠️ Max {matched.quantity} {matched.unit || "unit(s)"}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </td>
                {billingMode === "amount_based" ? (
                  <>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700 text-sm">
                      ₹{" "}
                      {(
                        Number(newItem.totalAmount || 0) / Math.max(1, Number(newItem.qty || 1))
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        placeholder="Total"
                        min="0"
                        step="0.01"
                        value={newItem.totalAmount || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, totalAmount: Math.max(0, Number(e.target.value)) })
                        }
                        onKeyDown={handleKeyDown}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-center text-sm"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={newItem.price || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: Math.max(0, Number(e.target.value)) })
                        }
                        onKeyDown={handleKeyDown}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-center text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600 text-sm">
                      ₹ {(newItem.qty * newItem.price).toFixed(2)}
                    </td>
                  </>
                )}
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={handleCancelAdd}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    title="Cancel"
                  >
                    <X size={20} />
                  </button>
                </td>
              </tr>
            )}

            {fields.length === 0 && !isAdding && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationParticularsTable;
