# Business Management Dashboard 📊

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-10.12.2-orange.svg)](https://firebase.google.com/)

A comprehensive web application built with React and Firebase to help small businesses manage sales, expenses, customers, and inventory efficiently.



## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features-✨)
- [Tech Stack](#tech-stack-🛠️)
- [Getting Started](#getting-started-🚀)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing-🤝)
- [License](#license)
- [Contact](#contact)

---

## About The Project

This project was created to provide a simple yet powerful tool for small business owners to digitize their daily operations. It replaces traditional paper-based bookkeeping with a secure, cloud-based solution. Users can track financial transactions, manage customer relationships, and monitor inventory levels from a clean, modern dashboard.

---

## Key Features ✨

* **Secure Authentication**: User registration and login system powered by Firebase Authentication.
* **Business Profile Setup**: A one-time setup for business details (name, address, GSTIN) that appear on invoices.
* **Financial Dashboard**: At-a-glance overview of daily, monthly, and yearly profits.
* **Transaction Management**: Easily add sales and purchase/expense records.
* **Invoice Generation**: Automatically create and print professional invoices for any sale.
* **Customer Management**: View a list of all customers, their total spending, and their complete transaction history.
* **Inventory Control**: Manage both finished products (with rates) and raw materials stock.
* **Reporting**: Visualize monthly sales, expenses, and profits with interactive bar charts.
* **Historical Log**: A date-filterable view of all sales and purchases in chronological order.

---

## Tech Stack 🛠️

* **Frontend**: [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
* **Charting**: [Recharts](https://recharts.org/)
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## Getting Started 🚀

Follow these steps to get a local copy up and running.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
* **npm**
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd your-repository-name
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up your Firebase project**
    * Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    * Create a new Web App and copy the `firebaseConfig` credentials.
    * Enable **Authentication** (Email/Password method).
    * Enable **Firestore Database** (start in test mode for development).

5.  **Create an environment file**
    * Create a `.env.local` file in the root of your project.
    * Copy the contents of `.env.example` (or the block below) into it and fill in your Firebase project credentials.

    ```env
    # .env.local

    # Your Firebase Project Credentials
    VITE_FIREBASE_API_KEY="AIzaSy...YOUR_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

    # A unique ID for your app's data path in Firestore
    VITE_APP_ID="my-business-app-data"
    ```

6.  **Run the development server**
    ```sh
    npm run dev
    ```
    Your app should now be running on `http://localhost:5173` (or a similar port).

---

## Usage

After installation, open the application in your browser. You will be prompted to create an account. Once registered and logged in, you must complete the "Business Profile Setup" page. This information is used to populate your invoices. After that, you'll have full access to the dashboard and all its features.

---

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/your-username/your-repository-name](https://github.com/your-username/your-repository-name)