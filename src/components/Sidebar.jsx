import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../App";
import { ChartIcon, ArchiveBoxIcon, CashIcon, ChevronDownIcon, DocumentTextIcon, LogoutIcon, MenuIcon, ShoppingCartIcon, UsersIcon, CogIcon } from './Icons';

export const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage, user, businessProfile, theme }) => {
  const [openMenu, setOpenMenu] = useState('Sale');

  const handleLogout = () => signOut(auth);

  const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <ChartIcon /> },
    {
      id: 'Sale', text: 'Sale', icon: <CashIcon />,
      subItems: [
        { id: 'addSale', text: 'Add Sale' },
        { id: 'quotations', text: 'Quotations' },
        { id: 'challans', text: 'Delivery Challan' },
        { id: 'invoices', text: 'Invoices' },
      ]
    },
    {
      id: 'Purchase', text: 'Purchase', icon: <ShoppingCartIcon />,
      subItems: [
        { id: 'addExpense', text: 'Add Expense' },
      ]
    },
    {
      id: 'Items', text: 'Items', icon: <ArchiveBoxIcon />,
      subItems: [
        { id: 'itemsProducts', text: 'Products Rate' },
        { id: 'itemsMaterials', text: 'Raw Materials' },
      ]
    },
    { id: 'parties', text: 'Parties', icon: <UsersIcon /> },
    {
      id: 'Report', text: 'Report', icon: <DocumentTextIcon />,
      subItems: [
        { id: 'reportGraphs', text: 'Graphs' },
        { id: 'reportHistory', text: 'History' },
      ]
    },
    { id: 'settings', text: 'Settings', icon: <CogIcon /> }
  ];

  const handleNavClick = (item) => {
    if (item.subItems) {
      setOpenMenu(openMenu === item.id ? null : item.id);
    } else {
      setCurrentPage(item.id);
    }
  };

  return (
    <div className={` ${theme} bg-gray-100 dark:bg-gray-900 dark:border-r-2 text-black dark:text-white fixed top-0 left-0 h-full flex flex-col transition-all duration-300 z-20 ${isOpen ? 'w-64' : 'w-20'} shadow-2xl drop-shadow-black/50`}>
      <div className="flex items-center justify-between p-4 border-b border-black dark:border-white h-20">
        {isOpen && <span className="text-xl font-bold truncate">{businessProfile.businessName}</span>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">
          <MenuIcon />
        </button>
      </div>
      <nav className="flex-1 mt-4 space-y-2 px-2 overflow-y-auto">
        {navItems.map(item => (
          <div key={item.id}>
            <button
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors bg-gray-200 dark:bg-gray-700 ${currentPage === item.id ? 'bg-indigo-600 dark:bg-indigo-600 text-white' : item.subItems?.some(subItem => subItem.id === currentPage) ? 'bg-yellow-400 dark:bg-yellow-500 text-black' : 'text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'} ${!isOpen && 'justify-center'}`}>
              <div className="flex items-center">
              {item.icon}
              {isOpen && <span className="ml-4 font-bold text-xl">{item.text}</span>}
            </div>
            {isOpen && item.subItems && <ChevronDownIcon className={`transition-transform ${openMenu === item.id && 'rotate-180'}`} />}
          </button>
            { isOpen && openMenu === item.id && item.subItems && (
            <div className="mt-1 ml-6 pl-4 border-l-5 border-black dark:border-gray-500 space-y-1">
              {item.subItems.map(sub => (
                <button key={sub.id} onClick={() => setCurrentPage(sub.id)} className={`w-full text-left p-2 rounded-lg text-lg transition-colors ${currentPage === sub.id ? 'bg-indigo-600 text-white' : 'text-black dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                  {sub.text}
                </button>
              ))}
            </div>
          )}
    </div>
  ))
}
      </nav >
  <div className="p-4 border-t-4 border-black dark:border-white">
    <button onClick={handleLogout} className={`w-full flex items-center p-3 rounded-lg transition-colors text-black dark:text-white dark:bg-gray-800 hover:text-white hover:bg-red-400 ${!isOpen && 'justify-center'}`}>
      <LogoutIcon />
      {isOpen && <span className="ml-4 font-bold text-xl">Logout</span>}
    </button>
    {isOpen && <p className="text-xs text-center text-black dark:text-white mt-2 truncate">{user.email}</p>}
  </div>
    </div >
  );
};