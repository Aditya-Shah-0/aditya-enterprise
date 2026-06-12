export const StatCard = ({ title, value, icon }) => (
    <div className={`bg-gray-100 p-4 rounded-2xl shadow-lg/20 border-l-4 border-gray-600 flex items-center space-x-6`}>
        <div className="shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-black text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        </div>
    </div>
);
