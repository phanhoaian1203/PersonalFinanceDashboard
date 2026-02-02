import axiosClient from "../api/axiosClient";

const categoryService = {
    getAll: (userId = 1) => {
        return axiosClient.get(`/categories?userId=${userId}`);
    }
};

export default categoryService;