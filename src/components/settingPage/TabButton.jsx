import React from 'react'

const TabButton = ({ name, label, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(name)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === name
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
    >
        {label}
    </button>
);

export default TabButton
