import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaChartLine, FaFileInvoiceDollar, FaBoxes, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { error } = useAuth();

    useEffect(() => {
        if (error) {
            toast.error(error.response.data.message);
        }
    }, [error]);

    return (<>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-x-hidden font-sans">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <img src="../src/assets/360_F_831662113_ttkMPdMKmdr4bJbdp3MjJeQw4Paps66I-removebg-preview.png" alt="Logo" width="50" height="50" />
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight">Smart Invoice <span className="text-indigo-400"> Pro</span></Link>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Login
                    </button>
                    <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-32 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                    Manage your business <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                        with absolute clarity.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    The all-in-one ERP solution designed for modern businesses. Streamline invoicing, inventory, and accounting in one beautiful interface.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <button onClick={() => navigate('/register')} className="px-8 py-4 text-base font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all">
                        Start Free Trial
                    </button>
                    <button onClick={() => navigate('/app')} className="px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/40">
                        Access Dashboard
                    </button>
                </div>

                {/* Dashboard Preview / Abstract Rep */}
                <div className="mt-20 relative mx-auto w-full max-w-5xl">
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10"></div>
                    {/* Glass Card Representation */}
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl transform rotate-x-12 perspective-1000">
                        {/* Mock UI Structure */}
                        <div className="flex space-x-4 mb-6">
                            <div className="w-1/4 h-32 bg-white/5 rounded-xl animate-pulse"></div>
                            <div className="w-1/4 h-32 bg-white/5 rounded-xl animate-pulse delay-75"></div>
                            <div className="w-1/4 h-32 bg-white/5 rounded-xl animate-pulse delay-150"></div>
                            <div className="w-1/4 h-32 bg-white/5 rounded-xl animate-pulse delay-200"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-64 bg-white/5 rounded-xl"></div>
                            <div className="col-span-1 h-64 bg-white/5 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
                    <p className="text-gray-400">Packed with power, designed for simplicity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <FaFileInvoiceDollar />, title: "Smart Invoicing", desc: "Create professional GST invoices in seconds with automated tax calculations." },
                        { icon: <FaBoxes />, title: "Inventory Control", desc: "Real-time stock tracking with low inventory alerts and purchase management." },
                        { icon: <FaChartLine />, title: "Financial Insights", desc: "Detailed reports and analytics to help you make data-driven decisions." },
                        { icon: <FaShieldAlt />, title: "Secure & Cloud-Based", desc: "Your data is encrypted and accessible from anywhere, anytime." },
                        { icon: <div className="text-2xl font-bold text-indigo-400">AI</div>, title: "AI Assistant", desc: "Get smart suggestions and automate repetitive tasks." },
                        { icon: <div className="text-2xl font-bold text-pink-400">⚡</div>, title: "Lightning Fast", desc: "Optimized for speed so you never wait for your data." },
                    ].map((feature, idx) => (
                        <div key={idx} className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
                            <div className="text-3xl text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Grid */}


            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; 2025 GeminiERP. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    </>
    );
};
