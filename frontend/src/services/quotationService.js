import api from "../api/axios";

export const quotationService = {
    addQuotation: async (data) => {
        const response = await api.post("/quotation/add", data);
        return response.data;
    },
    getQuotations: async () => {
        const response = await api.get("/quotation/get");
        return response.data;
    },
    updateQuotationStatus: async (id, status) => {
        const response = await api.patch(`/quotation/status/${id}`, { status });
        return response.data;
    },
    deleteQuotation: async (id) => {
        const response = await api.delete(`/quotation/delete/${id}`);
        return response.data;
    }
};
