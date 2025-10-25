import React, { useState } from "react";
import { doc,setDoc } from "firebase/firestore";
import { db } from "../App";

export const BusinessSetupPage = ({ user, onProfileCreated }) => {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGst] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!businessName || !address || !phone) {
      setError("Please fill in Business Name, Address, and Phone.");
      return;
    }
    setLoading(true);
    setError('');
    const profileData = { businessName, address, gst, phone, email: user.email, ME: 0 };
    try {
      const appId = import.meta.env.VITE_APP_ID || "my-unique-app-id";
      const profileRef = doc(db, `artifacts/${appId}/users/${user.uid}/businessProfile/profile`);
      await setDoc(profileRef, profileData);
      onProfileCreated(profileData);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Setup Your Business Profile</h1>
        <p className="text-center text-gray-400 mb-8">This information will appear on your invoices.</p>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business Name" required className="w-full bg-gray-700 p-3 rounded-lg" />
          <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Business Address" required className="w-full bg-gray-700 p-3 rounded-lg" rows="3"></textarea>
          <input type="text" value={gst} onChange={e => setGst(e.target.value.toUpperCase())} placeholder="GST Number (Optional)" className="w-full bg-gray-700 p-3 rounded-lg" />
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" required className="w-full bg-gray-700 p-3 rounded-lg" />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};