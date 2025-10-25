import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../App'; // Import auth from App.jsx

const SubscriptionPage = ({ user }) => {
  
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl text-center">
        
        <h1 className="text-3xl font-bold text-red-400 mb-4">Account Not Activated</h1>
        
        {user?.email && (
          <p className="text-lg text-gray-300 mb-2">
            Your account (<span className="font-semibold text-white">{user.email}</span>) is pending activation.
          </p>
        )}

        <p className="text-gray-400 mb-8">
          Please contact the administration to activate your account by purchasing a subscription.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-6">Subscription Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1: 7 Days */}
          <div className="bg-gray-700 p-6 rounded-lg border-2 border-gray-600 transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">7-Day Pass</h3>
            <p className="text-3xl font-bold text-indigo-400 mb-4">₹499</p>
            <p className="text-gray-400">Full access for one week.</p>
          </div>

          {/* Plan 2: Monthly (Highlighted) */}
          <div className="bg-gray-700 p-6 rounded-lg border-2 border-indigo-500 shadow-lg transform hover:scale-105 transition-transform scale-105">
            <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
            <p className="text-3xl font-bold text-indigo-400 mb-4">₹1,499</p>
            <p className="text-gray-400">Best value for ongoing use.</p>
          </div>

          {/* Plan 3: Yearly */}
          <div className="bg-gray-700 p-6 rounded-lg border-2 border-gray-600 transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold text-white mb-2">Yearly</h3>
            <p className="text-3xl font-bold text-indigo-400 mb-4">₹14,999</p>
            <p className="text-gray-400">Set it and forget it for a year.</p>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="mt-10 bg-gray-600 text-white rounded-lg py-3 px-8 font-semibold hover:bg-gray-700 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default SubscriptionPage;