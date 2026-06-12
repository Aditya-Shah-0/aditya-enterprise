import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage/LandingPage';
import RegisterPage from './components/AuthPage/RegisterPage';
import LoginPage from './components/AuthPage/LoginPage';
import RequireAuth from './pages/RequireAuth';
import Dashboard from './components/App/Dashboard/Dashboard';
import SaleDashboard from './components/App/Sale/SaleDashboard';
import Purchase from './components/App/Purchase/AddExpense';
import Items from './components/App/Items/MaterialStock';
import ItemDetails from './components/App/Items/ItemDetails';
import Parties from './components/App/Parties/Parties';
import Report from './components/App/Report/History';
import SettingRequireAuth from './pages/SettingRequireAuth';
import Account from './components/App/Settings/Account/Account';
import BussinessSetupPage from './components/App/Settings/BussinessSetting/BussinessSetupPage';
import InvoiceSetupPage from './components/App/Settings/InvoiceSetting/InvoiceSettings';
import PrintSetupPage from './components/App/Settings/PrintingSetup/PrintingSetup';
import HelpAndSupportPage from './components/App/Settings/HelpAndSupport/Help&Support';
import AboutPage from './components/App/Settings/About/AboutPage';
import AddSaleForm from './components/App/Sale/AddSaleForm';
import InvoiceView from './components/App/Sale/InvoiceView';
import QuotationDashboard from './components/App/Quotation/QuotationDashboard';
import CreateQuotationForm from './components/App/Quotation/CreateQuotationForm';
import QuotationView from './components/App/Quotation/QuotationView';
import SaleDetailsView from './components/App/Sale/SaleDetailsView';
import EditSaleForm from './components/App/Sale/EditSaleForm';
import PurchaseDetailsView from './components/App/Purchase/PurchaseDetailsView';
import EditPurchaseForm from './components/App/Purchase/EditPurchaseForm';
import DuesDeliveryDashboard from './components/App/DuesDelivery/DuesDeliveryDashboard';

export default function AuthHandler() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/app" element={<RequireAuth />}>
        <Route path='' element={<Navigate to="dashboard" replace />} />
        <Route path='dashboard' element={<Dashboard />} />

        <Route path='sale'>
          <Route index element={<SaleDashboard />} />
          <Route path='addsale' element={<AddSaleForm />} />
          <Route path='invoiceview/:id' element={<InvoiceView />} />
          <Route path='view/:id' element={<SaleDetailsView />} />
          <Route path='edit/:id' element={<EditSaleForm />} />
        </Route>

        <Route path='purchase'>
          <Route index element={<Purchase />} />
          <Route path='view/:id' element={<PurchaseDetailsView />} />
          <Route path='edit/:id' element={<EditPurchaseForm />} />
        </Route>
        
        <Route path='items'>
          <Route index element={<Items />} />
          <Route path='item/:id' element={<ItemDetails />} />
        </Route>

        <Route path='parties' element={<Parties />} />
        <Route path='dues-delivery' element={<DuesDeliveryDashboard />} />
        <Route path='report' element={<Report />} />
        <Route path='quotation'>
          <Route index element={<QuotationDashboard />} />
          <Route path='create' element={<CreateQuotationForm />} />
          <Route path='view/:id' element={<QuotationView />} />
        </Route>
      </Route>
      <Route path='/settings' element={<SettingRequireAuth />}>
        <Route path='' element={<Navigate to="bussinessSetup" replace />} />
        <Route path='account' element={<Account />} />
        <Route path='bussinessSetup' element={<BussinessSetupPage />} />
        <Route path='invoiceSetup' element={<InvoiceSetupPage />} />
        <Route path='printSetup' element={<PrintSetupPage />} />
        <Route path='helpAndSupport' element={<HelpAndSupportPage />} />
        <Route path='about' element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
