import React from 'react'

const FormInput = ({ label, name, value, onChange, type = 'text', placeholder, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white dark:bg-gray-700 text-black dark:text-gray-200 rounded-md p-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
    </div>
);

export default FormInput
