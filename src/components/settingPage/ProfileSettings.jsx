import React , {useState,useEffect} from 'react';
import FormInput from './FormInput';

const ProfileSettings = ({ businessProfile, onProfileUpdate, showFeedback }) => {
    const [profile, setProfile] = useState(businessProfile);
    useEffect(() => setProfile(businessProfile), [businessProfile]);

    const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await onProfileUpdate(profile);
            showFeedback('Profile details updated successfully!', 'success');
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            showFeedback('Failed to update profile.', 'error');
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <FormInput label="Business Name" name="businessName" value={profile.businessName} onChange={handleChange} required />
            <FormInput label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} required />
            <FormInput label="GST Number" name="gst" value={profile.gst} onChange={handleChange} />
             <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Business Address</label>
                <textarea id="address" name="address" value={profile.address} onChange={handleChange} rows="3" className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>
            <div className="text-right">
                <button type="submit" className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-indigo-700">Save Changes</button>
            </div>
        </form>
    );
};

export default ProfileSettings
