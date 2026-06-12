import { useForm } from 'react-hook-form';
import { RegisterSchema } from '../../Schemas/RegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors, isSubmitting, } } = useForm({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await authService.register(data);

            toast.success("Register Successfull.. Redirecting to login page");

            setTimeout(() => {
                navigate('/app');
            }, 2000);

            console.log(response.data);
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Registration Failed";
            if (status == 409 || message.toLowerCase().includes("email already exists")) {
                setError("email", { type: "manual", message: "Email already exists please login" });
                toast.error("Email already exists please login");
            } else {
                toast.error(message);
            }
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden font-sans relative">
            {/* Background Gradients */}
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
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">Create Account</h2>
                            <p className="text-gray-400 mt-2 text-sm">Join Smart Invoice Pro and transform your business today.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    {...register("name")}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 text-white"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name.message}</p>}
                            </div>

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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Phone Number</label>
                                    <input
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        {...register("phone")}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 text-white"
                                        placeholder="9876543210"
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="panNumber" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">PAN Number</label>
                                    <input
                                        type="text"
                                        id="panNumber"
                                        name="panNumber"
                                        {...register("panNumber")}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 text-white uppercase"
                                        placeholder="ABCDE1234F"
                                    />
                                    {errors.panNumber && <p className="text-red-400 text-xs mt-1 ml-1">{errors.panNumber.message}</p>}
                                </div>
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
                                        Creating Account...
                                    </span>
                                ) : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage