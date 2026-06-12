import api from "../api/axios";

export const authService = {
    login: async (data) => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },
    register: async (data) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },
    checkUser: async () => {
        const response = await api.get("/auth/check");
        return response.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
}