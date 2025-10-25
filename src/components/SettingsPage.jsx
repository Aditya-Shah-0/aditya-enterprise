import React, { useState } from "react";
import AppearanceSettings from "./settingPage/AppearanceSettings";
import BankingSettings from "./settingPage/BankingSettings";
import SecuritySettings from "./settingPage/SecuritySettings";
import BrandingSettings from "./settingPage/BrandingSettings";
import ProfileSettings from "./settingPage/ProfileSettings";
import SettingsCard from "./settingPage/SettingsCard";

// --- Settings Page ---
export const SettingsPage = ({ user, businessProfile, onProfileUpdate, theme, setTheme, bankAccounts, onBankAction }) => {
    // Shared feedback state
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const showFeedback = (message, type) => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-lg drop-shadow-black">
            <h2 className="text-3xl font-bold mb-6 text-black dark:text-gray-200">Settings</h2>

            {feedback.message && (
                <div className={`p-3 rounded-lg mb-6 text-sm ${feedback.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200'}`}>
                    {feedback.message}
                </div>
            )}

            <div>
                <SettingsCard title="Business Information"><ProfileSettings businessProfile={businessProfile} onProfileUpdate={onProfileUpdate} showFeedback={showFeedback} /></SettingsCard>
                <BrandingSettings businessProfile={businessProfile} onProfileUpdate={onProfileUpdate} showFeedback={showFeedback} />
                <SettingsCard title="Change Password"><SecuritySettings user={user} showFeedback={showFeedback} /></SettingsCard>
                <SettingsCard title="Bank Account Details"><BankingSettings bankAccounts={bankAccounts} onBankAction={onBankAction} showFeedback={showFeedback} /></SettingsCard>
                <SettingsCard title="Theme"><AppearanceSettings theme={theme} setTheme={setTheme} /></SettingsCard>
            </div>
        </div>
    );
};