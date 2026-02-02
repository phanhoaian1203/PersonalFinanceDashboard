import axios from 'axios';

const axiosClient = axios.create({
    // Đường dẫn gốc tới Backend API
    baseURL: 'https://localhost:7207/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cấu hình Interceptors (Bộ đón chặn)
// Sau này dùng để tự động gắn Token vào mỗi request
axiosClient.interceptors.request.use(async (config) => {
    // Tạm thời chưa có Auth, ta để trống
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        // Trả về dữ liệu sạch (response.data) thay vì nguyên cục response của Axios
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Xử lý lỗi chung (ví dụ: mất mạng, server sập)
        console.error("Lỗi API:", error);
        throw error;
    }
);

export default axiosClient;