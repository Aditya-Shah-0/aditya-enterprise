import api from "../api/axios";

export const purchaseService = {
    addPurchase: async (data) => {
        const response = await api.post("/purchase/add", data);
        return response.data;
    },
    getPurchases: async () => {
        const response = await api.get("/purchase/get");
        return response.data;
    },
    updatePurchase: async (id, data) => {
        const response = await api.patch(`/purchase/update/${id}`, data);
        return response.data;
    },
    modifyPurchase: async (id, data) => {
        const response = await api.put(`/purchase/modify/${id}`, data);
        return response.data;
    },
    updateDeliveryStatus: async (id, deliveryStatus) => {
        const response = await api.patch(`/purchase/delivery/${id}`, { deliveryStatus });
        return response.data;
    }
};
