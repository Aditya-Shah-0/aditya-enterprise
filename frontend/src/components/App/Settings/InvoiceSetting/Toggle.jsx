const Toggle = ({ label, name, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="accent-blue-600 w-4 h-4" />
    </label>
);

export default Toggle;