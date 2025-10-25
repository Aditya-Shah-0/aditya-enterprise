import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "./Icons";

export const MaterialStock = ({ materials, onMaterialAction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialName, setMaterialName] = useState('');
  const [materialQty, setMaterialQty] = useState(0);
  const [materialUnit, setMaterialUnit] = useState('');

  const handleSave = () => {
    if (!materialName || !materialUnit) return;
    if (editingMaterial) { onMaterialAction('update', { id: editingMaterial.id, name: materialName, quantity: materialQty, unit: materialUnit }); }
    else { onMaterialAction('add', { name: materialName, quantity: materialQty, unit: materialUnit }); }
    handleCancel();
  };
  const handleEdit = (material) => {
    setEditingMaterial(material); setMaterialName(material.name); setMaterialQty(material.quantity); setMaterialUnit(material.unit); setIsAdding(true);
  };
  const handleCancel = () => {
    setIsAdding(false); setEditingMaterial(null); setMaterialName(''); setMaterialQty(0); setMaterialUnit('');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-sky-500/50">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">Raw Materials Stock</h2>
      <div className="flex justify-end mb-4">
        {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700">Add New Material</button>}
      </div>
      {isAdding && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingMaterial ? 'Edit Material' : 'Add New Material'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Material Name" value={materialName} onChange={e => setMaterialName(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600" />
            <input type="number" placeholder="Quantity" value={materialQty} onChange={e => setMaterialQty(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600" />
            <input type="text" placeholder="Unit (e.g., kg, pcs, ream)" value={materialUnit} onChange={e => setMaterialUnit(e.target.value)} className="w-full bg-white dark:bg-gray-800 rounded-md p-2 border-gray-300 dark:border-gray-600" />
          </div>
          <div className="flex justify-end space-x-4"><button onClick={handleCancel} className="bg-gray-500 text-white rounded-md px-4 py-2">Cancel</button><button onClick={handleSave} className="bg-green-600 text-white rounded-md px-4 py-2">{editingMaterial ? 'Save Changes' : 'Add Material'}</button></div>
        </div>
      )}
      <div className="space-y-3">{materials.map(material => (
        <div key={material.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center shadow-2xl drop-shadow-black">
          <p className="font-semibold">{material.name}</p>
          <div className="flex items-center space-x-4">
            <span className="font-bold">{material.quantity} {material.unit}</span>
            <button onClick={() => handleEdit(material)} className="text-blue-600 hover:text-blue-400"><PencilIcon className="w-5 h-5" /></button>
            <button onClick={() => onMaterialAction('delete', { id: material.id })} className="text-red-600 hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
          </div>
        </div>
      ))}</div>
    </div>
  );
};