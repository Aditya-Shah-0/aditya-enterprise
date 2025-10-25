import React from 'react'

const SettingsCard = ({ title, children }) => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl drop-shadow-black p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">{title}</h3>
        {children}
    </div>
);

export default SettingsCard
