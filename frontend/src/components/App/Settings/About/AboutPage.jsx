import React from 'react';
import { Target, Users, Award, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen font-sans rounded-2xl bg-white">

            {/* 1. HERO SECTION */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Empowering Businesses with <span className="text-blue-600">Smarter Solutions</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                        We build tools that simplify complex business processes. From invoicing to inventory,
                        our mission is to help you focus on what truly matters—growing your business.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/settings/helpAndSupport" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            Our Journey
                        </Link>
                        <Link to="/settings/helpAndSupport" className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Contact Support <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. STATS SECTION (Builds Trust) */}
            <div className="max-w-6xl mx-auto px-6 py-12 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Active Businesses', value: '10,000+', icon: Briefcase },
                        { label: 'Invoices Generated', value: '2.5M+', icon: CheckCircle2 },
                        { label: 'User Satisfaction', value: '99.8%', icon: Award },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MISSION & STORY */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4">
                            OUR MISSION
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Building the operating system for modern commerce.
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Founded in 2024, Aditya Enterprise began with a simple idea: business software shouldn't be complicated.
                            We noticed that small business owners were spending hours on spreadsheets instead of serving their customers.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Today, we provide a comprehensive suite of tools that handle everything from GST compliant invoicing to
                            real-time inventory tracking. We believe technology should work for you, not the other way around.
                        </p>

                        <ul className="space-y-3">
                            {[
                                'Customer-First Approach',
                                'Transparent Pricing',
                                'Enterprise-Grade Security',
                                '24/7 Dedicated Support'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-10 blur-xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                            alt="Team meeting"
                            className="relative rounded-2xl shadow-xl border border-gray-200 w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* 4. TEAM SECTION */}
            <div className="bg-white border-t border-gray-200 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet the Leadership</h2>
                        <p className="text-gray-500">The minds behind the innovation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Aditya Shah', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
                            { name: 'Sarah Johnson', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
                            { name: 'David Chen', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' }
                        ].map((member, i) => (
                            <div key={i} className="group text-center">
                                <div className="relative inline-block mb-4 overflow-hidden rounded-full border-4 border-gray-100 w-32 h-32">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-blue-600 font-medium text-sm mb-3">{member.role}</p>
                                <p className="text-gray-500 text-sm px-8">
                                    Dedicated to creating seamless experiences for our global user base.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. CTA SECTION */}
            <div className="bg-gray-900 text-white py-10 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to modernize your business?</h2>
                <p className="text-gray-400 mb-8 text-lg">
                    Join thousands of businesses that trust us with their financial operations.
                </p>
            </div>

        </div>
    );
};

export default AboutPage;