import React from 'react'

const AppearanceSettings = ({ theme, setTheme }) => {
    return (
        <div>
            <p className="mb-2 text-gray-600 dark:text-gray-400">Select your preferred theme.</p>
            <div className="flex space-x-4">
                <button onClick={() => setTheme('light')} className={`px-6 py-2 rounded-md ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Light</button>
                <button onClick={() => setTheme('dark')} className={`px-6 py-2 rounded-md ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Dark</button>
            </div>
        </div>
    );
};


export default AppearanceSettings
