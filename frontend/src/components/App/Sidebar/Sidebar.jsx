import { NavLink, Link } from 'react-router-dom';
import { ChartColumnBig, Banknote, ShoppingCart, Warehouse, Handshake, FileCheck, LogOut, Settings, FileText, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <ChartColumnBig /> },
    { id: 'sale', text: 'Sale', icon: <Banknote /> },
    { id: 'purchase', text: 'Purchase', icon: <ShoppingCart /> },
    { id: 'items', text: 'Items', icon: <Warehouse /> },
    { id: 'parties', text: 'Parties', icon: <Handshake /> },
    { id: 'report', text: 'Report', icon: <FileCheck /> },
    { id: 'quotation', text: 'Quotation', icon: <FileText /> },
    { id: 'dues-delivery', text: 'Dues & Delivery', icon: <Clock /> },
  ];

  return (
    <div className="bg-slate-100 text-black border-8 border-double h-full flex flex-col transition-all duration-300 z-20 w-64 rounded-2xl">
      <div className="flex items-center justify-between p-4 border-b-4 border-double border-black dark:border-white h-14">
        <Link to="/app" className="text-xl font-bold truncate">BussinessName</Link>
        <button
          className="p-2 bg-red-200 rounded-lg transition-colors text-black dark:text-white dark:bg-gray-800 hover:text-white hover:bg-red-400"
          onClick={logout}
        >
          <LogOut />
        </button>
      </div>
      <nav className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar">
        <div className="flex-1 mt-4 space-y-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={`/app/${item.id}`}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors hover:text-black  ${isActive ? 'bg-blue-800 shadow-xl/30 shadow-blue-800 text-white hover:bg-blue-800' : 'hover:bg-gray-500 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-2">{item.text}</span>
            </NavLink>
          ))}
        </div>
        <div className="py-4 px-2 border-t-4 border-double border-black">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `bg-green-200 flex items-center p-2 rounded-lg transition-colors hover:bg-green-800 hover:shadow-2xl hover:text-white hover:text-bold ${isActive ? 'bg-blue-800 shadow-xl/30 shadow-blue-800 text-white hover:bg-blue-800' : ''
              }`
            }
          >
            <Settings />
            <span className="ml-2">Settings</span>
          </NavLink>
        </div>
      </nav >
    </div >
  );
};

export default Sidebar;