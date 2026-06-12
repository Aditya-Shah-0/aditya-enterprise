import api from "../api/axios";

export const itemService = {
    getItems: async () => {
        const response = await api.get("/item/get-all");
        return response.data;
    },
    addItem: async (data) => {
        const response = await api.post("/item/add", data);
        return response.data;
    },
    updateItem: async (id, data) => {
        const response = await api.patch(`/item/update/${id}`, data);
        return response.data;
    },
    deleteItem: async (id) => {
        const response = await api.delete(`/item/delete/${id}`);
        return response.data;
    },
    getItemDetails: async (id) => {
        const response = await api.get(`/item/details/${id}`);
        return response.data;
    }
};
