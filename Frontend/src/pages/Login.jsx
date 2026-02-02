import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight } from "lucide-react";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await authService.login(form.username, form.password);
            // Lưu trạng thái đăng nhập
            login(data.token, { username: data.username, fullName: data.fullName });
            // Chuyển hướng vào Dashboard
            navigate("/"); 
        } catch (err) {
            setError(err.response?.data || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Chào mừng trở lại!</h2>
                        <p className="text-slate-500 mt-2">Vui lòng đăng nhập để quản lý chi tiêu</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tài khoản</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={20} className="text-slate-400" />
                                </div>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    placeholder="Nhập username"
                                    value={form.username}
                                    onChange={(e) => setForm({...form, username: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400" />
                                </div>
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Đang xử lý..." : <>Đăng nhập <ArrowRight size={20} /></>}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Chưa có tài khoản? <a href="#" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;