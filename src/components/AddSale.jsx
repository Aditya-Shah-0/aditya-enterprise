import React, { useState, useMemo } from "react";
import { formatCurrency } from "./utils";
import { XCircleIcon, PlusCircleIcon } from "./Icons";

export const AddSale = ({ onSave, products, onProductAction, onSaleComplete }) => {
  const [partyName, setPartyName] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.price), 0), [items]);

  const handleProductInputChange = (e) => {
    const name = e.target.value;
    setProductName(name);
    const product = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (product) {
      setPrice(product.rate);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (productName && quantity > 0 && price > 0) {
      setItems([...items, { productName, quantity: Number(quantity), price: Number(price) }]);
      setProductName(''); setQuantity(1); setPrice('');
    }
  };
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (partyName && partyPhone && items.length > 0) {
      // Check for new products and add them
      for (const item of items) {
        const productExists = products.some(p => p.name.toLowerCase() === item.productName.toLowerCase());
        if (!productExists) {
          await onProductAction('add', { name: item.productName, rate: item.price, description: 'Auto-added from sale' });
        }
      }
      await onSave({ partyName, partyPhone, paymentMode, items, total, date: new Date().toISOString() });
      onSaleComplete();
    } else alert("Please fill party details and add at least one item.");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-2xl shadow-amber-500/40 max-w-4xl mx-auto">
    <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">
        Create New Sale
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
            type="text"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            placeholder="Party Name"
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
        <input
            type="text"
            value={partyPhone}
            onChange={(e) => setPartyPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
        <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        >
            <option>Cash</option>
            <option>UPI</option>
            <option>Cheque</option>
        </select>
    </div>

    <div className="border-t border-black dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-black dark:text-gray-300 mb-4">
            Products
        </h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
            <div className="md:col-span-2">
                <input
                    list="products-list"
                    value={productName}
                    onChange={handleProductInputChange}
                    placeholder="Select or type a product"
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
                />
                <datalist id="products-list">
                    {products.map(p => <option key={p.id} value={p.name} />)}
                </datalist>
            </div>
            <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
                placeholder="Qty"
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
            />
            <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Rate"
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
            />
            <button type="submit" className="bg-indigo-600 text-white rounded-md p-2 flex items-center justify-center hover:bg-indigo-700">
                Add Item
            </button>
        </form>
    </div>

    {items.length > 0 && (
        <ul className="mt-4 space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
                    <span>{item.productName} ({item.quantity} x {formatCurrency(item.price)})</span>
                    <div className="flex items-center gap-4">
                        <span>{formatCurrency(item.quantity * item.price)}</span>
                        <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-400">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )}

    <div className="border-t border-black dark:border-gray-700 mt-6 pt-6 flex justify-between items-center">
        <span className="text-xl font-bold">
            Total: {formatCurrency(total)}
        </span>
        <button onClick={handleSave} className="bg-green-600 text-white rounded-md px-6 py-3 font-bold hover:bg-green-700 flex items-center">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Save Sale
        </button>
    </div>
</div>
  );
}