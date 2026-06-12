import api from "../api/axios";

export const todoService = {
    addTodo: async (task) => {
        const response = await api.post("/todo/add", { task });
        return response.data;
    },
    getTodos: async () => {
        const response = await api.get("/todo/get");
        return response.data;
    },
    updateTodo: async (id, data) => {
        const response = await api.patch(`/todo/update/${id}`, data);
        return response.data;
    },
    deleteTodo: async (id) => {
        const response = await api.delete(`/todo/delete/${id}`);
        return response.data;
    }
};

export default todoService;
