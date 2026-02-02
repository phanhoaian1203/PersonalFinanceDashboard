import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";

const TransactionForm = ({ onSuccess }) => {
    // State lưu dữ liệu người dùng nhập
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0], // Mặc định là ngày hôm nay (YYYY-MM-DD)
        categoryId: ""
    });

    // 1. Lấy danh sách Danh mục để đổ vào Dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll(1); // UserId = 1
                setCategories(data);
                
                // Mặc định chọn danh mục đầu tiên nếu có
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Xử lý khi người dùng nhập liệu
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. Xử lý khi bấm nút "Lưu"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn reload trang
        try {
            // Gọi API thêm mới
            await transactionService.create({
                ...formData,
                amount: Number(formData.amount), // Đảm bảo số tiền là dạng số
                categoryId: Number(formData.categoryId)
            });

            // Reset form cho đẹp
            setFormData({
                amount: "",
                description: "",
                date: new Date().toISOString().split('T')[0],
                categoryId: categories[0]?.id || ""
            });

            alert("Thêm thành công!");
            
            // Báo cho Dashboard biết để load lại danh sách
            if (onSuccess) onSuccess(); 
            
        } catch (error) {
            console.error(error);
            alert("Lỗi khi thêm giao dịch!");
        }
    };

    return (
        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>➕ Thêm Giao dịch mới</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
                
                <div>
                    <label>Số tiền:</label><br/>
                    <input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        required 
                        style={{ padding: "5px" }}
                    />
                </div>

                <div>
                    <label>Danh mục:</label><br/>
                    <select 
                        name="categoryId" 
                        value={formData.categoryId} 
                        onChange={handleChange}
                        style={{ padding: "6px" }}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.icon} {c.name} ({c.type === 'Income' ? 'Thu' : 'Chi'})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Mô tả:</label><br/>
                    <input 
                        type="text" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="VD: Ăn sáng..."
                        style={{ padding: "5px" }}
                    />
                </div>

                <div>
                    <label>Ngày:</label><br/>
                    <input 
                        type="date" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange}
                        style={{ padding: "5px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "6px 15px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Lưu
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;