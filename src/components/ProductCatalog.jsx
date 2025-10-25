import React, { useState } from "react";
import { formatCurrency } from "./utils";
import { PencilIcon, TrashIcon } from "./Icons";

export const ProductCatalog = ({ products, onProductAction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productRate, setProductRate] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSave = () => {
    if (!productName || !productRate) return;
    if (editingProduct) { onProductAction('update', { id: editingProduct.id, name: productName, rate: productRate, description: productDescription }); }
    else { onProductAction('add', { name: productName, rate: productRate, description: productDescription }); }
    handleCancel();
  };
  const handleEdit = (product) => {
    setEditingProduct(product); setProductName(product.name); setProductRate(product.rate); setProductDescription(product.description || ''); setIsAdding(true);
  };
  const handleCancel = () => {
    setIsAdding(false); setEditingProduct(null); setProductName(''); setProductRate(''); setProductDescription('');
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-sky-500/50">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">Products Rate</h2>
      <div className="flex justify-end mb-4">
        {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700">Add New Product</button>}
      </div>
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 space-y-4 shadow-2xl drop-shadow-black ">
          <h3 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600 md:col-span-2" />
            <input type="number" placeholder="Rate" value={productRate} onChange={e => setProductRate(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600" />
          </div>
          <textarea placeholder="Product description (optional)" value={productDescription} onChange={e => setProductDescription(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600" rows="2"></textarea>
          <div className="flex justify-end space-x-4"><button onClick={handleCancel} className="bg-gray-500 text-white rounded-md px-4 py-2">Cancel</button><button onClick={handleSave} className="bg-green-600 text-white rounded-md px-4 py-2">{editingProduct ? 'Save Changes' : 'Add Product'}</button></div>
        </div>
      )}
      <div className="space-y-3">{products.map(product => (
        <div key={product.id} className="bg-gray-100 dark:bg-gray-700 shadow-2xl drop-shadow-black p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{product.name}</p>
            <div className="flex items-center space-x-4">
              <span>{formatCurrency(product.rate)}</span>
              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-400"><PencilIcon className="w-5 h-5" /></button>
              <button onClick={() => onProductAction('delete', { id: product.id })} className="text-red-600 hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
            </div>
          </div>
          {product.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-2 border-l-2 border-gray-300 dark:border-gray-600">{product.description}</p>}
        </div>
      ))}</div>
    </div>
  )
};