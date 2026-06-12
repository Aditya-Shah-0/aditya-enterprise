import React from 'react';
import { Loader2 } from 'lucide-react';

const BusinessSetupHeader = ({ isSaving, onSave }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-300">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Business Settings</h1>
                <p className="text-sm text-gray-500">Edit Your Company Settings And Information</p>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button 
                    type="button" 
                    className="px-6 py-2 border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded font-medium text-sm cursor-pointer hover:bg-indigo-800 disabled:opacity-70 flex items-center gap-2 transition-colors"
                >
                    {isSaving && <Loader2 className="animate-spin h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default BusinessSetupHeader;
