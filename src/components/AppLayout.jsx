import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, doc, getDoc, updateDoc, deleteDoc, } from "firebase/firestore";
import { db } from "../App";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { AddSale } from "./AddSale";
import { AddExpense } from "./AddExpense";
import { InvoiceHistory } from "./InvoiceHistory";
import { ProductCatalog } from "./ProductCatalog";
import { MaterialStock } from "./MaterialStock";
import { Parties } from "./Parties";
import { ReportGraphs } from "./ReportGraphs";
import { History } from "./History";
import { InvoiceModal } from './InvoiceModal';
import { SettingsPage } from './SettingsPage';

export const AppLayout = ({ user, businessProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('addSale');
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [theme, setTheme] = useState('dark')
  const userId = user.uid;

  useEffect(() => {
    if (!db || !userId) return;
    setLoading(true);
    const appId = import.meta.env.VITE_APP_ID || "my-unique-app-id";

    const createSubscription = (collectionName, setData) => {
      const q = query(collection(db, `artifacts/${appId}/users/${userId}/${collectionName}`));
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (collectionName === 'sales') data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(data);
        if (loading) setLoading(false);
      }, err => {
        console.error(`${collectionName} Snapshot Error:`, err);
        setError(`Failed to load ${collectionName} data.`);
        setLoading(false);
      });
    };

    const unsubSales = createSubscription('sales', setSales);
    const unsubExpenses = createSubscription('expenses', setExpenses);
    const unsubProducts = createSubscription('products', setProducts);
    const unsubMaterials = createSubscription('materials', setMaterials);
    const unsubBankAccounts = createSubscription('bankAccounts', setBankAccounts);

    return () => {
      unsubSales();
      unsubExpenses();
      unsubProducts();
      unsubMaterials();
      unsubBankAccounts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getCollectionPath = (coll) => {
    const appId = import.meta.env.VITE_APP_ID || "my-unique-app-id";
    return `artifacts/${appId}/users/${userId}/${coll}`;
  }

  const handleUpdateProfile = async (updatedData) => {
    const appId = import.meta.env.VITE_APP_ID || "my-unique-app-id";
    const profileRef = doc(db, `artifacts/${appId}/users/${user.uid}/businessProfile/profile`);
    await updateDoc(profileRef, updatedData);
  };

  const handleSaveSale = async (newSale) => await addDoc(collection(db, getCollectionPath('sales')), newSale);

  const handleSaveExpense = async (newExpense) => {
    await addDoc(collection(db, getCollectionPath('expenses')), newExpense);
    const materialRef = doc(db, getCollectionPath('materials'), newExpense.materialId);
    const materialDoc = await getDoc(materialRef);
    if (materialDoc.exists()) {
      await updateDoc(materialRef, { quantity: (materialDoc.data().quantity || 0) + parseFloat(newExpense.quantity) });
    }
  };

  const handleProductAction = async (action, data) => {
    const coll = getCollectionPath('products');
    if (action === 'add') await addDoc(collection(db, coll), { name: data.name, rate: parseFloat(data.rate), description: data.description || '' });
    else if (action === 'update') await updateDoc(doc(db, coll, data.id), { name: data.name, rate: parseFloat(data.rate), description: data.description || '' });
    else if (action === 'delete') await deleteDoc(doc(db, coll, data.id));
  };

  const handleMaterialAction = async (action, data) => {
    const coll = getCollectionPath('materials');
    if (action === 'add') await addDoc(collection(db, coll), { name: data.name, quantity: parseFloat(data.quantity) || 0, unit: data.unit });
    else if (action === 'update') await updateDoc(doc(db, coll, data.id), { name: data.name, quantity: parseFloat(data.quantity) || 0, unit: data.unit });
    else if (action === 'delete') await deleteDoc(doc(db, coll, data.id));
  };

  const handleBankAction = async (action, data) => {
    const coll = getCollectionPath('bankAccounts');

    if (action === 'add') {
      // eslint-disable-next-line no-unused-vars
      const { id, ...dataToSave } = data;
      await addDoc(collection(db, coll), dataToSave);

    } else if (action === 'update') {
      const { id, ...dataToUpdate } = data;
      const docRef = doc(db, coll, id);
      await updateDoc(docRef, dataToUpdate);

    } else if (action === 'delete') {
      await deleteDoc(doc(db, coll, data.id));
    }
  };

  const renderPage = () => {
    if (loading) return <div className="text-center p-10">Loading Your Data...</div>;
    if (error) return <div className="text-center p-10 text-red-400">{error}</div>;

    switch (currentPage) {
      case 'dashboard': return <Dashboard sales={sales} expenses={expenses} />;
      case 'addSale': return <AddSale onSave={handleSaveSale} products={products} onProductAction={handleProductAction} onSaleComplete={() => setCurrentPage('dashboard')} />;
      case 'quotations': return <div className="text-center p-10">Quotations Page (Coming Soon)</div>;
      case 'challans': return <div className="text-center p-10">Delivery Challans Page (Coming Soon)</div>;
      case 'invoices': return <InvoiceHistory sales={sales} onViewInvoice={setViewingInvoice} />;
      case 'addExpense': return <AddExpense onSave={handleSaveExpense} materials={materials} onMaterialAction={handleMaterialAction} onExpenseComplete={() => setCurrentPage('dashboard')} />;
      case 'itemsProducts': return <ProductCatalog products={products} onProductAction={handleProductAction} />;
      case 'itemsMaterials': return <MaterialStock materials={materials} onMaterialAction={handleMaterialAction} />;
      case 'parties': return <Parties sales={sales} onViewInvoice={setViewingInvoice} />;
      case 'reportGraphs': return <ReportGraphs sales={sales} expenses={expenses} />;
      case 'reportHistory': return <History sales={sales} expenses={expenses} />;
      case 'settings': return <SettingsPage user={user} businessProfile={businessProfile} onProfileUpdate={handleUpdateProfile} theme={theme} setTheme={setTheme} bankAccounts={bankAccounts} onBankAction={handleBankAction} />;
      default: return <AddSale onSave={handleSaveSale} products={products} onProductAction={handleProductAction} onSaleComplete={() => setCurrentPage('dashboard')} />;
    }
  };

  const modernUrl = businessProfile ? `https://wa.me/${businessProfile.phone}` : "#";

  return (
    <div className={`${theme} bg-gray-200 dark:bg-gray-900 text-black dark:text-white min-h-screen font-sans flex`}>
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        businessProfile={businessProfile}
        theme = {theme}
      />
      <div className={`rounded-3xl flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col min-h-screen`}>
        <div className="container mx-auto p-4 md:p-8 flex-grow">
          <main>
            {renderPage()}
          </main>
        </div>
        <footer className="py-5.5 border-t-4 border-black dark:border-white">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 p-2 rounded-full transition-all duration-300 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-500/40"
                aria-label="Facebook"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href="#"
                className="text-gray-400 p-2 rounded-full transition-all duration-300 hover:text-pink-500 hover:shadow-lg hover:shadow-pink-500/40"
                aria-label="Instagram"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href={modernUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 p-2 rounded-full transition-all duration-300 hover:text-green-500 hover:shadow-lg hover:shadow-green-500/40"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={28} />
              </a>
            </div>
            <div className="">
              <p className="text-lg">Version 4.2</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg">Phone: +91 {businessProfile.phone} | Email: {businessProfile.email}</p>
              <p className="mt-2 text-lg">Made with ❤️ by {businessProfile.businessName}</p>
            </div>
          </div>
        </footer>
      </div>
      {viewingInvoice && <InvoiceModal sale={viewingInvoice} businessProfile={businessProfile} bankAccounts={bankAccounts} onClose={() => setViewingInvoice(null)} />}
    </div>
  );
};