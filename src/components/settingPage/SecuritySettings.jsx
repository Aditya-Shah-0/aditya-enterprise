import React, {useState} from 'react';
import { reauthenticateWithCredential, updatePassword , EmailAuthProvider } from 'firebase/auth';
import FormInput from './FormInput';

const SecuritySettings = ({ user, showFeedback }) => {
    const [passwords, setPasswords] = useState({ oldPass: '', newPass: '', confirmPass: '' });

    const handleChange = e => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSave = async e => {
        e.preventDefault();
        if (passwords.newPass !== passwords.confirmPass) {
            showFeedback('New passwords do not match.', 'error');
            return;
        }
        if (passwords.newPass.length < 6) {
            showFeedback('New password must be at least 6 characters.', 'error');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, passwords.oldPass);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwords.newPass);
            showFeedback('Password updated successfully!', 'success');
            setPasswords({ oldPass: '', newPass: '', confirmPass: '' });
        } catch (err) {
            showFeedback('Failed to update password. Please check your old password.', 'error');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <FormInput label="Old Password" name="oldPass" value={passwords.oldPass} onChange={handleChange} type="password" required />
            <FormInput label="New Password" name="newPass" value={passwords.newPass} onChange={handleChange} type="password" required />
            <FormInput label="Confirm New Password" name="confirmPass" value={passwords.confirmPass} onChange={handleChange} type="password" required />
            <div className="text-right">
                <button type="submit" className="bg-indigo-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-indigo-700">Update Password</button>
            </div>
        </form>
    );
};

export default SecuritySettings
