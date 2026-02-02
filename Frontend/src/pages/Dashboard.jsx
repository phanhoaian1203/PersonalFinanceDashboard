import { useEffect, useState } from "react";
import transactionService from "../services/transactionService";
import TransactionForm from "../components/TransactionForm";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State lưu giao dịch đang được chọn để sửa (null = không sửa gì cả)
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            const data = await transactionService.getAll(1);
            setTransactions(data);
        } catch (error) {
            console.error("Không lấy được dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Hàm xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
            try {
                await transactionService.delete(id);
                alert("Đã xóa!");
                fetchTransactions(); // Load lại danh sách
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Không xóa được!");
            }
        }
    };

    // Hàm xử lý khi bấm nút Sửa (chỉ đơn giản là set dữ liệu vào state để Form tự bắt)
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        // Cuộn màn hình lên đầu để người dùng thấy Form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>Quản lý Chi tiêu cá nhân</h1>
            
            {/* Truyền thêm props edit xuống Form */}
            <TransactionForm 
                onSuccess={fetchTransactions} 
                editingTransaction={editingTransaction}
                cancelEdit={() => setEditingTransaction(null)}
            />

            <hr style={{ margin: "30px 0", borderTop: "1px solid #eee" }} />

            <h3>📜 Lịch sử giao dịch</h3>
            <table border="1" cellPadding="12" style={{ width: "100%", borderCollapse: "collapse", borderColor: "#ddd" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                        <th>Ngày</th>
                        <th>Danh mục</th>
                        <th>Mô tả</th>
                        <th>Số tiền</th>
                        <th>Loại</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>
                            <td>
                                <span style={{ color: t.color, fontWeight: "bold" }}>
                                    {t.categoryName}
                                </span>
                            </td>
                            <td>{t.description}</td>
                            <td style={{ 
                                color: t.type === "Income" ? "green" : "red", 
                                fontWeight: "bold",
                                textAlign: "right"
                            }}>
                                {t.amount.toLocaleString("vi-VN")} đ
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <span style={{ 
                                    padding: "4px 8px", 
                                    borderRadius: "4px", 
                                    backgroundColor: t.type === "Income" ? "#d4edda" : "#f8d7da",
                                    color: t.type === "Income" ? "#155724" : "#721c24",
                                    fontSize: "12px"
                                }}>
                                    {t.type === "Income" ? "Thu" : "Chi"}
                                </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                {/* Nút Sửa */}
                                <button 
                                    onClick={() => handleEdit(t)}
                                    style={{ marginRight: "5px", cursor: "pointer", padding: "5px 10px", backgroundColor: "#ffc107", border: "none", borderRadius: "4px" }}
                                >
                                    Sửa
                                </button>
                                
                                {/* Nút Xóa */}
                                <button 
                                    onClick={() => handleDelete(t.id)}
                                    style={{ cursor: "pointer", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;