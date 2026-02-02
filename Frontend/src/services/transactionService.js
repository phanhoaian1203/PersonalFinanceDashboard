import axiosClient from "../api/axiosClient";

const transactionService = {
    // Lấy danh sách giao dịch
    getAll: (userId = 1) => {
        return axiosClient.get(`/transactions?userId=${userId}`);
    },

    // Tạo giao dịch mới
    create: (data) => {
        return axiosClient.post('/transactions', data);
    },

    // Xóa giao dịch
    delete: (id) => {
        return axiosClient.delete(`/transactions/${id}`);
    },

    // Cập nhật giao dịch
    update: (id, data) => {
        return axiosClient.put(`/transactions/${id}`, data);
    }
};

export default transactionService;