import { useEffect, useState, useMemo } from "react";
import { 
    LayoutDashboard, Wallet, PieChart, Settings, LogOut, 
    Search, Bell, Plus, TrendingUp, TrendingDown, Trash2, Edit, ChevronLeft, ChevronRight
} from "lucide-react";
// Import biểu đồ tròn (PieChart) và biểu đồ cột (BarChart)
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

import transactionService from "../services/transactionService";
import TransactionForm from "../components/TransactionForm";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // --- State Phân trang ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- State Biểu đồ ---
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const fetchTransactions = async () => {
        try {
            const data = await transactionService.getAll(1);
            setTransactions(data);
            processDataForCharts(data); // Xử lý dữ liệu cho biểu đồ ngay khi tải xong
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Hàm xử lý dữ liệu cho Biểu đồ (Logic thông minh) ---
    const processDataForCharts = (data) => {
        // 1. Biểu đồ Cột (Theo tháng)
        const months = {}; // { "T2": {Income: 100, Expense: 50}, "T3": ... }
        
        data.forEach(t => {
            const date = new Date(t.date);
            const monthKey = `T${date.getMonth() + 1}`; // T1, T2...
            
            if (!months[monthKey]) months[monthKey] = { name: monthKey, Income: 0, Expense: 0 };
            
            if (t.type === 'Income') months[monthKey].Income += t.amount;
            else months[monthKey].Expense += t.amount;
        });
        // Chuyển object thành mảng và sắp xếp theo tháng
        const barChartData = Object.values(months).sort((a, b) => 
            parseInt(a.name.substring(1)) - parseInt(b.name.substring(1))
        );
        setMonthlyData(barChartData);

        // 2. Biểu đồ Tròn (Cơ cấu chi tiêu)
        const categories = {}; // { "Ăn uống": 50000, "Nhà cửa": 100000 }
        data.filter(t => t.type === 'Expense').forEach(t => {
            if (!categories[t.categoryName]) categories[t.categoryName] = 0;
            categories[t.categoryName] += t.amount;
        });
        
        const pieChartData = Object.keys(categories).map(key => ({
            name: key,
            value: categories[key]
        }));
        setCategoryData(pieChartData);
    };

    // --- Tính toán thống kê tổng quan ---
    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);

    // --- Logic Phân trang ---
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc muốn xóa không?")) {
            await transactionService.delete(id);
            fetchTransactions();
        }
    };

    const handleOpenAdd = () => { setEditingTransaction(null); setIsModalOpen(true); };
    const handleEdit = (t) => { setEditingTransaction(t); setIsModalOpen(true); };

    // Màu cho biểu đồ tròn
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar (Giữ nguyên) */}
            <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white h-screen sticky top-0 border-r border-slate-800">
                <div className="flex items-center gap-3 px-8 py-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white"><Wallet size={24} /></div>
                    <div><h1 className="text-lg font-bold">FinFlow</h1><p className="text-slate-400 text-xs">Quản lý cá nhân</p></div>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Tổng quan" active />
                    <NavItem icon={<PieChart size={20}/>} label="Thống kê" />
                    <NavItem icon={<Settings size={20}/>} label="Cài đặt" />
                </nav>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="sticky top-0 z-20 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-slate-800">Tổng quan tài chính</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all active:scale-95">
                            <Plus size={20} /><span className="font-bold text-sm">Thêm mới</span>
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Stats Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Số dư hiện tại" amount={stats.balance} icon={<Wallet size={24} />} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard title="Tổng thu nhập" amount={stats.income} icon={<TrendingUp size={24} />} color="text-emerald-600" bg="bg-emerald-50" />
                        <StatCard title="Tổng chi tiêu" amount={stats.expense} icon={<TrendingDown size={24} />} color="text-orange-600" bg="bg-orange-50" />
                    </section>

                    {/* Biểu đồ */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Biểu đồ Cột */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6">Biểu đồ Thu/Chi theo tháng</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Income" name="Thu nhập" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Expense" name="Chi tiêu" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Biểu đồ Tròn */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center">
                            <h3 className="text-lg font-bold mb-4 w-full text-left">Cơ cấu chi tiêu</h3>
                            <div className="w-full h-64">
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie 
                                                data={categoryData} 
                                                cx="50%" cy="50%" 
                                                innerRadius={60} 
                                                outerRadius={80} 
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' đ'} />
                                            <Legend verticalAlign="bottom" height={36}/>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-400">Chưa có dữ liệu chi tiêu</div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Bảng dữ liệu + Phân trang */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <h3 className="font-bold text-lg">Giao dịch gần đây</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Ngày</th>
                                        <th className="px-6 py-4">Mô tả</th>
                                        <th className="px-6 py-4">Danh mục</th>
                                        <th className="px-6 py-4 text-right">Số tiền</th>
                                        <th className="px-6 py-4 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(t.date).toLocaleDateString("vi-VN")}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{t.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: t.color + '20', color: t.color }}>
                                                    {t.categoryName}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${t.type === 'Income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'Income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:bg-red-100 rounded"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedTransactions.length === 0 && <tr><td colSpan="5" className="text-center py-10 text-slate-400">Chưa có giao dịch nào.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Thanh Phân trang */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                                <span className="text-sm text-slate-500">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handlePageChange(currentPage - 1)} 
                                        disabled={currentPage === 1}
                                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handlePageChange(currentPage + 1)} 
                                        disabled={currentPage === totalPages}
                                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {isModalOpen && <TransactionForm onSuccess={fetchTransactions} editingTransaction={editingTransaction} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <a href="#" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        {icon}<span className="text-sm font-semibold">{label}</span>
    </a>
);

const StatCard = ({ title, amount, icon, color, bg }) => (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bg} ${color}`}>{icon}</div>
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-slate-900 text-2xl font-bold mt-1">{amount.toLocaleString('vi-VN')} đ</h3>
    </div>
);

export default Dashboard;