import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";
import { X, Check, Calendar, Edit3, DollarSign, ChevronDown, AlertCircle } from "lucide-react";

const TransactionForm = ({ onSuccess, editingTransaction, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null); // State lưu thông báo lỗi
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        categoryId: ""
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll(1);
                setCategories(data);
                if (!editingTransaction && data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (err) {
                console.error(err);
                setError("Không tải được danh mục!");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                amount: editingTransaction.amount,
                description: editingTransaction.description,
                date: new Date(editingTransaction.date).toISOString().split('T')[0],
                categoryId: editingTransaction.categoryId
            });
        }
    }, [editingTransaction]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Xóa lỗi khi người dùng sửa lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation cơ bản ở Frontend
        if (Number(formData.amount) <= 0) {
            setError("Số tiền phải lớn hơn 0");
            setLoading(false);
            return;
        }
        if (!formData.description.trim()) {
            setError("Vui lòng nhập mô tả");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                categoryId: Number(formData.categoryId)
            };

            if (editingTransaction) {
                await transactionService.update(editingTransaction.id, payload);
            } else {
                await transactionService.create(payload);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            // Lấy thông báo lỗi từ Backend nếu có (err.response.data)
            setError(err.response?.data || "Có lỗi xảy ra khi lưu!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-[540px] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">
                        {editingTransaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-6 py-6 overflow-y-auto flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Số tiền</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign className="text-slate-400" size={24} />
                            </div>
                            <input 
                                type="number" name="amount" value={formData.amount} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-4 text-3xl font-bold text-slate-900 placeholder:text-slate-300 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" 
                                placeholder="0" required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Ngày</label>
                            <div className="relative">
                                <input type="date" name="date" value={formData.date} onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm" 
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><Calendar size={18} /></div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Danh mục</label>
                            <div className="relative">
                                <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm appearance-none"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {/* SỬA LỖI 2 DẤU CHẤM HỎI: Chỉ hiện tên nếu icon bị lỗi */}
                                            {c.icon && c.icon !== '??' ? c.icon : ''} {c.name} ({c.type === 'Income' ? 'Thu' : 'Chi'})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><ChevronDown size={18} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Mô tả</label>
                        <div className="relative">
                            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Ví dụ: Ăn sáng, Tiền nhà..."
                                className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400"><Edit3 size={18} /></div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            {loading ? 'Đang lưu...' : <><Check size={18} /> Lưu Giao dịch</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;