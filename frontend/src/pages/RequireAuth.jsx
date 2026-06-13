import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/App/Sidebar/Sidebar";
import { Loader2 } from "lucide-react";
import logo from "../assets/360_F_831662113_ttkMPdMKmdr4bJbdp3MjJeQw4Paps66I-removebg-preview.png";

const RequireAuth = () => {
    const { owner, loading } = useAuth();

    if (loading) {
        return (
            <div className="bg-black h-screen flex p-2 gap-2 overflow-hidden">
                <div className="flex-1 bg-gray-200 dark:bg-gray-900 border-8 border-double border-black dark:border-gray-800 transition-all duration-300 h-full rounded-2xl overflow-hidden flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Logo with subtle pulse effect behind it */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-20 h-20 object-contain relative z-10 animate-bounce"
                                style={{ animationDuration: '3s' }}
                            />
                        </div>

                        {/* Loading indicator and text */}
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
                                Loading Workspace
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Preparing your dashboard...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return owner ?
        <>
            <div className="bg-black h-screen flex p-2 gap-2 overflow-hidden">
                <Sidebar />
                <div className="flex-1 bg-gray-200 border-8 border-double border-black transition-all duration-300 h-full rounded-2xl overflow-y-auto no-scrollbar">
                    <div className="container mx-auto p-2 md:p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </> : <Navigate to="/" replace />;
};

export default RequireAuth;