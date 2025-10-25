import React, { useState } from "react";
import { PlusCircleIcon } from "./Icons";

export const AddExpense = ({ onSave, materials, onMaterialAction, onExpenseComplete }) => {
  const [materialName, setMaterialName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState('');
  const [vendor, setVendor] = useState('');
  const [isNewMaterial, setIsNewMaterial] = useState(false);
  const [newMaterialUnit, setNewMaterialUnit] = useState('');

  const handleMaterialInputChange = (e) => {
    const name = e.target.value;
    setMaterialName(name);
    const materialExists = materials.some(m => m.name.toLowerCase() === name.toLowerCase());
    setIsNewMaterial(!materialExists && name.length > 0);
  };

  const handleSave = async () => {
    let materialId;
    if (isNewMaterial) {
      if (!newMaterialUnit) {
        alert("Please provide a unit for the new material.");
        return;
      }
      materialId = await onMaterialAction('add', { name: materialName, unit: newMaterialUnit, quantity: 0 });
    } else {
      const existingMaterial = materials.find(m => m.name.toLowerCase() === materialName.toLowerCase());
      if (!existingMaterial) {
        alert("Please select or create a valid material.");
        return;
      }
      materialId = existingMaterial.id;
    }

    if (materialId && quantity > 0 && cost > 0) {
      await onSave({ materialId, materialName, quantity: parseFloat(quantity), total: parseFloat(cost), vendor, date: new Date().toISOString() });
      onExpenseComplete();
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg shadow-purple-500/50 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-gray-300">
        Add Purchase
      </h2>

      {/* Form Inputs */}
      <div className="space-y-4">
        <input
          list="materials-list"
          value={materialName}
          onChange={handleMaterialInputChange}
          placeholder="Select or type a material"
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
        <datalist id="materials-list">
          {materials.map(m => <option key={m.id} value={m.name} />)}
        </datalist>

        {isNewMaterial && (
          <input
            type="text"
            value={newMaterialUnit}
            onChange={e => setNewMaterialUnit(e.target.value)}
            placeholder="Unit (e.g., kg, pcs, ream)"
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
          />
        )}

        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
        <input
          type="number"
          value={cost}
          onChange={e => setCost(e.target.value)}
          placeholder="Total Cost"
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          value={vendor}
          onChange={e => setVendor(e.target.value)}
          placeholder="Vendor (Optional)"
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-2 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="border-t border-black dark:border-gray-700 mt-6 pt-6 flex justify-end">
        <button onClick={handleSave} className="bg-green-600 text-white rounded-md px-6 py-3 font-bold hover:bg-green-700 flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Save Purchase
        </button>
      </div>
    </div>
  );
};