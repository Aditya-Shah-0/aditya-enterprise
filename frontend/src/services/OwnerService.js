import api from "../api/axios";

export const ownerService = {
    updateOwner: async (data) => {
        const response = await api.patch("/owner/update-profile", data);
        return response.data;
    },
    updatePassword: async (data) => {
        const response = await api.patch("/owner/update-password", data);
        return response.data;
    },
    updateBusinessInfo: async (data) => {
        const response = await api.post("/owner/update-business-info", data);
        return response.data;
    },
    getBusinessInfo: async () => {
        const response = await api.get("/owner/get-business-info");
        return response.data;
    },
    updateInvoiceSettings: async (data) => {
        const response = await api.post("/owner/update-invoice-settings", data);
        return response.data;
    },
    getInvoiceSettings: async () => {
        const response = await api.get("/owner/get-invoice-settings");
        return response.data;
    },
    uploadBusinessAssets: async (formData) => {
        const response = await api.post("/owner/upload-business-assets", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
}