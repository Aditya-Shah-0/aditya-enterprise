import { useState } from "react";
import React from 'react';
import FormInput from "./FormInput";
import { PencilIcon, TrashIcon } from "../Icons";

const BankingSettings = ({ bankAccounts, onBankAction, showFeedback }) => {
    const blankAccount = { id: null, bankName: '', accountNumber: '', ifscCode: '', branch: '', address: '' };
    const [account, setAccount] = useState(blankAccount);
    const [showForm, setShowForm] = useState(false);

    const handleChange = e => setAccount({ ...account, [e.target.name]: e.target.value });

    const handleSave = async e => {
        e.preventDefault();
        try {
            const action = account.id ? 'update' : 'add';
            await onBankAction(action, account);
            showFeedback(`Bank account ${action === 'add' ? 'added' : 'updated'} successfully!`, 'success');
            handleCancel();
        } catch (err) {
            showFeedback('Failed to save bank account.', err);
        }
    };

    const handleEdit = (acc) => {
        setAccount(acc);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bank account?')) {
             try {
                await onBankAction('delete', { id });
                showFeedback('Bank account deleted.', 'success');
            } catch (err) {
                showFeedback('Failed to delete account.', err);
            }
        }
    };

    const handleCancel = () => {
        setAccount(blankAccount);
        setShowForm(false);
    };

    return (
        <div>
            {!showForm && (
                 <div className="text-right mb-4">
                    <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700">Add New Account</button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSave} className="space-y-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold">{account.id ? 'Edit' : 'Add'} Bank Account</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Bank Name" name="bankName" value={account.bankName} onChange={handleChange} required />
                        <FormInput label="Branch" name="branch" value={account.branch} onChange={handleChange} />
                        <FormInput label="Account Number" name="accountNumber" value={account.accountNumber} onChange={handleChange} required />
                        <FormInput label="IFSC Code" name="ifscCode" value={account.ifscCode} onChange={handleChange} required />
                    </div>
                     <FormInput label="Bank Address" name="address" value={account.address} onChange={handleChange} />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCancel} className="bg-red-500 text-white rounded-md px-6 py-2">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white rounded-md px-6 py-2">{account.id ? 'Save Changes' : 'Add Account'}</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {bankAccounts.length > 0 ? bankAccounts.map(acc => (
                    <div key={acc.id} className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{acc.bankName} - {acc.accountNumber}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{acc.branch} - {acc.ifscCode}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={() => handleEdit(acc)} className="text-blue-500 hover:text-blue-400 p-2"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => handleDelete(acc.id)} className="text-red-500 hover:text-red-400 p-2"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No bank accounts added.</p>}
            </div>
        </div>
    );
};

export default BankingSettings
