import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";

// Nhận thêm props: editingTransaction (dữ liệu cần sửa), cancelEdit (hủy sửa)
const TransactionForm = ({ onSuccess, editingTransaction, cancelEdit }) => {
    const [categories, setCategories] = useState([]);
    
    // State form
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        categoryId: ""
    });

    // 1. Lấy danh mục khi Component được load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll(1);
                setCategories(data);
                // Nếu đang KHÔNG sửa và chưa chọn danh mục, chọn cái đầu tiên
                if (!editingTransaction && data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Lắng nghe: Khi người dùng bấm "Sửa" ở bảng bên dưới -> Điền dữ liệu vào Form
    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                amount: editingTransaction.amount,
                description: editingTransaction.description,
                // Chuyển định dạng ngày về YYYY-MM-DD để input date hiểu
                date: new Date(editingTransaction.date).toISOString().split('T')[0],
                categoryId: editingTransaction.categoryId || (categories[0]?.id)
            });
        }
    }, [editingTransaction, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                categoryId: Number(formData.categoryId)
            };

            if (editingTransaction) {
                // === CHẾ ĐỘ SỬA ===
                await transactionService.update(editingTransaction.id, payload);
                alert("Cập nhật thành công!");
                cancelEdit(); // Thoát chế độ sửa
            } else {
                // === CHẾ ĐỘ THÊM ===
                await transactionService.create(payload);
                alert("Thêm thành công!");
            }

            // Reset form về mặc định
            setFormData({
                amount: "",
                description: "",
                date: new Date().toISOString().split('T')[0],
                categoryId: categories[0]?.id || ""
            });

            if (onSuccess) onSuccess(); // Load lại danh sách
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: editingTransaction ? "#fff3cd" : "#fff" }}>
            <h3>{editingTransaction ? "✏️ Đang sửa giao dịch" : "➕ Thêm Giao dịch mới"}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                    <label>Số tiền:</label><br/>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required style={{ padding: "5px" }} />
                </div>
                <div>
                    <label>Danh mục:</label><br/>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} style={{ padding: "6px" }}>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Mô tả:</label><br/>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="VD: Ăn sáng..." style={{ padding: "5px" }} />
                </div>
                <div>
                    <label>Ngày:</label><br/>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} style={{ padding: "5px" }} />
                </div>

                <button type="submit" style={{ padding: "6px 15px", backgroundColor: editingTransaction ? "#ffc107" : "#007bff", color: "black", border: "none", cursor: "pointer" }}>
                    {editingTransaction ? "Cập nhật" : "Lưu"}
                </button>

                {/* Nút Hủy sửa chỉ hiện khi đang sửa */}
                {editingTransaction && (
                    <button type="button" onClick={cancelEdit} style={{ padding: "6px 15px", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer", marginLeft: "5px" }}>
                        Hủy
                    </button>
                )}
            </form>
        </div>
    );
};

export default TransactionForm;