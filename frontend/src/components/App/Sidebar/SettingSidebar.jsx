import { NavLink, Link } from 'react-router-dom';
import { LogOut, UserLock, Building2, ReceiptIndianRupee, PrinterCheck, BadgeQuestionMark, EqualApproximately, Undo2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const menuItems = [
    { id: 'account', text: 'Account', icon: <UserLock /> },
    { id: 'bussinessSetup', text: 'Bussiness Setup', icon: <Building2 /> },
    { id: 'invoiceSetup', text: 'Invoice Setup', icon: <ReceiptIndianRupee /> },
    { id: 'printSetup', text: 'Print Setup', icon: <PrinterCheck /> },
    { id: 'helpAndSupport', text: 'Help & Support', icon: <BadgeQuestionMark /> },
    { id: 'about', text: 'About', icon: <EqualApproximately /> }
  ];

  return (
    <div className="bg-gray-200 text-black border-8 border-double h-full flex flex-col transition-all duration-300 z-20 w-64 rounded-2xl">
      <div className="flex items-center justify-between p-4 border-b-4 border-double border-black dark:border-white h-14">
        <Link to="/app" className="text-xl font-bold truncate">BussinessName</Link>
        <button
          onClick={logout}
          className="p-2 bg-red-200 rounded-lg transition-colors text-black dark:text-white dark:bg-gray-800 hover:text-white hover:bg-red-400"
        >
          <LogOut />
        </button>
      </div>
      <nav className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar">
        <div className="flex-1 mt-4 space-y-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={`/settings/${item.id}`}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-800 shadow-xl/30 shadow-blue-800 text-white hover:bg-blue-800 hover:text-black' : 'hover:bg-gray-500 hover:text-white'
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
            to="/app/dashboard"
            className={({ isActive }) =>
              `bg-green-200 flex items-center p-2 rounded-lg transition-colors hover:bg-green-800 hover:text-white ${isActive ? 'bg-blue-800 shadow-xl/30 shadow-blue-800 text-white hover:bg-blue-800' : 'hover:bg-gray-500 hover:text-white'
              }`
            }
          >
            <Undo2 />
            <span className="ml-2">Back to Dashboard</span>
          </NavLink>
        </div>
      </nav >
    </div >
  );
};

export default Sidebar;