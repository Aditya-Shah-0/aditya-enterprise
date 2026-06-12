import React from 'react';
import { Printer, Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrintingSetup = () => {
    return (
        <div className="min-h-screen bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-50 rounded-full opacity-50 blur-3xl"></div>

            <div className="relative z-10 max-w-lg">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Printer size={48} />
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                    Printing Setup <span className="text-blue-600">Coming Soon</span>
                </h1>

                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                    We are building a powerful printing configuration engine to help you customize your invoices and reports exactly how you want them.
                </p>

                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-8 flex items-start gap-3 text-left">
                    <Construction className="text-orange-500 mt-1 min-w-[20px]" size={20} />
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Under Development</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Our engineering team is currently working on this feature. It will include custom paper sizes, header/footer configuration, and thermal printer support.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Notify Me When Ready
                    </button>
                    <Link to="/settings" className="px-8 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={18} />
                        Back to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrintingSetup;