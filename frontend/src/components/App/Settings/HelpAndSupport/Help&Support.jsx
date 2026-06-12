import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp, HelpCircle, FileQuestion, Users, Search } from 'lucide-react';

const HelpAndSupportPage = () => {
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I update my business information?",
            answer: "You can update your business details by navigating to Settings > Business Setup. There you can edit your company name, GSTIN, address, and other contact information."
        },
        {
            question: "Can I manage multiple businesses?",
            answer: "Yes, our Multi-Business feature allows you to manage separate entities under a single account. Go to the Dashboard and click on the business switcher at the top left."
        },
        {
            question: "How do I export my invoice reports?",
            answer: "Go to the Reports section, select the 'Sales' or 'GST' tab, choose your date range, and click the 'Export to Excel' or 'Download PDF' button."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We use industry-standard encryption to protect your data. We also perform regular backups to ensure your information is never lost."
        }
    ];

    return (
        <div className="min-h-screen font-sans rounded-2xl bg-white pb-10">

            {/* 1. HERO SECTION */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-6">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        How can we <span className="text-blue-600">help you?</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions, get in touch with our team, or send us a message directly. We're here to assist you.
                    </p>

                    <div className="mt-8 relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                            placeholder="Search for answers..."
                        />
                    </div>
                </div>
            </div>

            {/* 2. CONTACT CARDS */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Email Support */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group text-center">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Mail size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                        <p className="text-gray-500 mb-4 text-sm">Get a response within 24 hours.</p>
                        <a href="mailto:support@adityaenterprise.com" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                            support@adityaenterprise.com
                        </a>
                    </div>

                    {/* Phone Support */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group text-center">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Phone size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                        <p className="text-gray-500 mb-4 text-sm">Mon-Fri from 9am to 6pm.</p>
                        <a href="tel:+919876543210" className="text-green-600 font-semibold hover:text-green-800 transition-colors">
                            +91 98765 43210
                        </a>
                    </div>

                    {/* Visit Us */}
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group text-center">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                        <p className="text-gray-500 mb-4 text-sm">Come say hello at our HQ.</p>
                        <p className="text-gray-700 font-medium whitespace-pre-line">
                            123 Business Park, Tech Hub,{'\n'}Mumbai, India 400001
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">

                {/* 3. FAQ SECTION */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <FileQuestion className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-200 transition-colors">
                                <button
                                    className="w-full px-6 py-4 text-left bg-white flex justify-between items-center focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className="font-semibold text-gray-800">{faq.question}</span>
                                    {activeAccordion === index ? (
                                        <ChevronUp size={20} className="text-blue-500" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400" />
                                    )}
                                </button>
                                {activeAccordion === index && (
                                    <div className="px-6 pb-4 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                                        <div className="pt-2">{faq.answer}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. CONTACT FORM */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                    </div>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Billing Issue</option>
                                <option>Feature Request</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="How can we help you today?"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Send size={18} />
                            Send Message
                        </button>
                    </form>
                </div>

            </div>

            {/* FOOTER NOTE */}
            <div className="text-center mt-12 text-gray-400 text-sm">
                <p>© 2024 Aditya Enterprise. All rights reserved.</p>
            </div>

        </div>
    );
};

export default HelpAndSupportPage;