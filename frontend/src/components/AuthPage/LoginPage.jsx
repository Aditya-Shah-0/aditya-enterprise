import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../Schemas/LoginSchema";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await authService.login(data);
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            toast.success("Login successful");
            login();
            setTimeout(() => navigate("/app"), 1000);
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Login Failed";
            if (status == 401 || message.toLowerCase().includes("Invalid email or password")) {
                toast.error("Invalid email or password");
            } else {
                toast.error(message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden font-sans relative">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">LOGIN</h2>
                            <p className="text-gray-400 mt-2 text-sm">login to your Smart Invoice Pro account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    {...register("email")}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 text-white"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    {...register("password")}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 text-white"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Login Account...
                                    </span>
                                ) : "Login Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default LoginPage