import axiosClient from "../api/axiosClient";

const authService = {
    login: async (username, password) => {
        const response = await axiosClient.post("/auth/login", { username, password });
        return response; // Trả về { token, username, fullName... }
    },
    
    register: async (data) => {
        return await axiosClient.post("/auth/register", data);
    }
};

export default authService;