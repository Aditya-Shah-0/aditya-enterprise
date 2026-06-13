import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { transactionService } from "../services/transactionService";
import { purchaseService } from "../services/purchaseService";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [owner, setOwner] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [purchases, setPurchases] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshTransactions = async () => {
        try {
            const transactions = await transactionService.getTransactions();
            setTransaction(transactions);
        } catch (err) {
            console.error("Failed to refresh transactions", err);
        }
    };

    const refreshPurchases = async () => {
        try {
            const purchaseRes = await purchaseService.getPurchases();
            setPurchases(purchaseRes);
        } catch (err) {
            console.error("Failed to refresh purchases", err);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await authService.checkUser();
                const transactions = await transactionService.getTransactions();
                const purchaseRes = await purchaseService.getPurchases();
                setOwner(response.owner);
                setTransaction(transactions);
                setPurchases(purchaseRes);
            } catch (error) {
                setError(error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                }
            } finally {
                setLoading(false);
            }
        }
        checkUser();
    }, [])

    const login = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.checkUser();
            const transactions = await transactionService.getTransactions();
            const purchaseRes = await purchaseService.getPurchases();
            setOwner(response.owner);
            setTransaction(transactions);
            setPurchases(purchaseRes);
        } catch (error) {
            setError(error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
            }
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            await authService.logout();
        } catch (error) {
            setError(error);
        } finally {
            localStorage.removeItem("token");
            setOwner(null);
            setTransaction(null);
            setPurchases(null);
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ owner, transaction, purchases, loading, error, login, logout, refreshTransactions, refreshPurchases }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
}
