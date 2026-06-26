import api from "../api/axios";

export const transactionService = {
    addTransaction: async (data) => {
        const response = await api.post("/transaction/add", data);
        return response.data;
    },
    getTransactions: async () => {
        const response = await api.get("/transaction/get");
        return response.data;
    },
    updateTransaction: async (id, data) => {
        const response = await api.patch(`/transaction/update/${id}`, data);
        return response.data;
    },
    modifyTransaction: async (id, data) => {
        const response = await api.put(`/transaction/modify/${id}`, data);
        return response.data;
    },
    updateDeliveryStatus: async (id, deliveryStatus) => {
        const response = await api.patch(`/transaction/delivery/${id}`, { deliveryStatus });
        return response.data;
    },
    recordBulkPayment: async (data) => {
        const response = await api.post("/transaction/bulk-payment", data);
        return response.data;
    }
}