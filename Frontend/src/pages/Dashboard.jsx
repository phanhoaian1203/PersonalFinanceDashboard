import { useEffect, useState } from "react";
import transactionService from "../services/transactionService";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm gọi API
    const fetchTransactions = async () => {
        try {
            // Gọi service, hard-code userId = 1 như Backend đang test
            const data = await transactionService.getAll(1); 
            setTransactions(data);
        } catch (error) {
            console.error("Không lấy được dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect chạy 1 lần khi trang vừa load
    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Quản lý Chi tiêu cá nhân</h1>
            
            {/* Hiển thị danh sách dạng bảng đơn giản */}
            <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Danh mục</th>
                        <th>Mô tả</th>
                        <th>Số tiền</th>
                        <th>Loại</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>
                            <td>
                                {/* Hiển thị màu sắc danh mục */}
                                <span style={{ color: t.color, fontWeight: "bold" }}>
                                    {t.categoryName}
                                </span>
                            </td>
                            <td>{t.description}</td>
                            <td style={{ 
                                color: t.type === "Income" ? "green" : "red", 
                                fontWeight: "bold" 
                            }}>
                                {t.amount.toLocaleString("vi-VN")} đ
                            </td>
                            <td>{t.type === "Income" ? "Thu nhập" : "Chi tiêu"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;