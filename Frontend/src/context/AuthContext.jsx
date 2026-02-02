import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm kiểm tra đăng nhập khi vừa vào web
    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Kiểm tra token hết hạn chưa
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setUser({ username: decoded.unique_name, ...decoded });
                        // Gắn token vào header mặc định của Axios
                        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    }
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkLogin();
    }, []);

    const login = (token, userInfo) => {
        localStorage.setItem("token", token);
        setUser(userInfo);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        delete axiosClient.defaults.headers.common["Authorization"];
        window.location.href = "/login"; // Force reload về trang login
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};