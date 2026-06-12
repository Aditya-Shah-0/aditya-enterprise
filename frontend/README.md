# Aditya Enterprise - Business Management Dashboard 📊

A comprehensive, production-ready enterprise dashboard application designed for small and medium-sized businesses. This app facilitates tracking sales, purchase bills, raw materials inventory, customer/vendor relationships, tax collections, cash flow streams, and delivery timelines.

---

## ⚡ Main Features

### 📦 Dues & Delivery Tracking (New)
* **Status Timeline**: Automatically computes delivery states (Overdue, Pending/To Be Delivered, Delivered) and calculates days left or overdue day count dynamically.
* **Timeline Updates**: Single-click status toggling ("Mark Delivered" / "Mark Pending") with automatic timestamp tracking (`deliveryDate`) and statistics update.
* **Date Bounds Filtering**: Interactive date filters, invoice search, and categorization to follow up on outstanding orders.

### 💰 Billing & Invoices
* **Dual Calculation Mode**: 
  - **Rate-Based Mode**: standard `Quantity × Unit Price` calculation.
  - **Amount-Based Mode**: input `Quantity` and `Total Amount` (auto-calculates unit rates), perfect for custom manufacturing.
* **Printable Invoices**: Multiple high-fidelity layout templates (Standard, Table, Bold, Rounded) with company logo and authorized signature attachments.
* **Shared Utilities**: Converts grand totals to words in the Indian numbering system (Lakhs & Crores).

### 💸 Payment Installments & Cash Flow
* **Partial Payments Ledger**: Record installment payments over time with a date picker and payment method selection (Cash, Bank Transfer, Online, Cheque, etc.).
* **Timeline Audit**: Non-printable payment logs rendered under invoice layouts for clear history auditing.
* **Dual Basis Reporting**: Toggle reports between **Accrual Basis (Invoice Date)** and **Cash Flow Basis (Payment Date)** to get real business analytics.

### 📈 Reports & Analytics
* **Interactive charts**: Visual trends for sales vs. purchase outflows.
* **Detailed ledgers**: Collapsible day-wise transactions ledgers and complete income statements (Profit & Loss).
* **GST Breakdown**: Estimates net tax liability comparing Output GST (customers) vs. Input GST (vendors).
* **Growth Insights**: Highlights top-selling products, top customers, top suppliers, and payment mode utilization ratios.

### 🤝 Parties & Contacts
* **Consolidated Contacts**: Aggregates customer and supplier profiles directly from transactions to prevent duplicate lists.
* **Traded Items Summary**: Aggregates traded item names, quantities, roles, and average prices for the active contact.

---

## 🛠️ Technology Stack

* **Frontend**: React.js (v18.2.0), Vite (v7.1.12), Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (via Mongoose schemas)
* **Visualizations**: Recharts
* **Icons & UI components**: Lucide React, React Hot Toast

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/en) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (running instance or Atlas connection URI)

### Local Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/Aditya-Shah-0/aditya-enterprise.git
   cd aditya-enterprise
   ```

2. **Backend Configuration**
   - Navigate to `/backend`
   - Create a `.env` file:
     ```env
     PORT=3000
     MONGO_URI="mongodb://localhost:27017/gemini"
     CORS_ORIGIN="http://localhost:5173"
     JWT_SECRET="your_jwt_secret_token"
     ```
   - Install dependencies and start server:
     ```sh
     npm install
     npm run dev
     ```

3. **Frontend Configuration**
   - Navigate to `/frontend`
   - Create a `.env.local` file:
     ```env
     VITE_API_URL="http://localhost:3000/api"
     ```
   - Install dependencies and start client:
     ```sh
     npm install
     npm run dev
     ```
   - Open browser at `http://localhost:5173`

---

## 🔒 Keyboard Shortcuts
Inside the invoice creation and modification forms:
- `Alt + A`: Add another item row to the particulars list.
- `Ctrl + S` / `Alt + S`: Save / Submit invoice changes.