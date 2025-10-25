import React, { useState, useEffect} from 'react';
import FormInput from './FormInput';
import SettingsCard from './SettingsCard';

const BrandingSettings = ({ businessProfile, onProfileUpdate, showFeedback }) => {
    const [branding, setBranding] = useState({
        tagline: businessProfile.tagline || '',
        logoUrl: businessProfile.logoUrl || '',
        qrCodeUrl: businessProfile.qrCodeUrl || '',
        facebookUrl: businessProfile.facebookUrl || '',
        instagramUrl: businessProfile.instagramUrl || '',
    });
    useEffect(() => setBranding({
        tagline: businessProfile.tagline || '',
        logoUrl: businessProfile.logoUrl || '',
        qrCodeUrl: businessProfile.qrCodeUrl || '',
        facebookUrl: businessProfile.facebookUrl || '',
        instagramUrl: businessProfile.instagramUrl || '',
    }), [businessProfile]);


    const handleChange = e => setBranding({ ...branding, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await onProfileUpdate(branding);
            showFeedback('Branding & Socials updated!', 'success');
        } catch (err) {
            showFeedback('Failed to update settings.', err);
        }
    };
    
    return(
        <form onSubmit={handleSave} className="space-y-6">
            <SettingsCard title="Business Branding">
                <div className="space-y-4">
                    <FormInput label="Business Tagline" name="tagline" value={branding.tagline} onChange={handleChange} placeholder="A catchy tagline for your business" />
                    <FormInput label="Logo Image URL" name="logoUrl" value={branding.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
                    <FormInput label="UPI QR Code Image URL" name="qrCodeUrl" value={branding.qrCodeUrl} onChange={handleChange} placeholder="https://example.com/upi-qr.png" />
                </div>
            </SettingsCard>
            <SettingsCard title="Social Handles">
                 <div className="space-y-4">
                    <FormInput label="Facebook URL" name="facebookUrl" value={branding.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/yourpage" />
                    <FormInput label="Instagram URL" name="instagramUrl" value={branding.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/yourprofile" />
                </div>
            </SettingsCard>
             <div className="text-right">
                <button type="submit" className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-indigo-700">Save All Changes</button>
            </div>
        </form>
    );
};

export default BrandingSettings
