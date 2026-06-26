import { useAuth } from "../../../../context/AuthContext";
import { Key, Save, Loader2, UserRoundPen } from "lucide-react";
import { AccountSchema } from "../../../../Schemas/AccountSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from 'react-hot-toast';
import { AccountPasswordChangeSchema } from "../../../../Schemas/AccountPasswordChangeSchema";
import { useState } from "react";
import { ownerService } from "../../../../services/OwnerService";

const Account = () => {
    const { owner } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors }
    } = useForm({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            ownerName: owner?.name || "",
            phoneNumber: owner?.phone || "0000000000"
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors }
    } = useForm({
        resolver: zodResolver(AccountPasswordChangeSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    // Handler: Update Profile
    const onUpdateProfile = async (data) => {
        setIsLoading(true);
        try {
            console.log("Updating Profile:", data);
            await ownerService.updateOwner(data);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };


    // Handler: Change Password
    const onChangePassword = async (data) => {
        setIsLoading(true);
        try {
            console.log("Updating Password:", data);
            await ownerService.updatePassword(data);
            toast.success("Password changed successfully");
            resetPasswordForm();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans rounded-2xl">

            <Toaster />

            <div className="flex flex-col md:flex-row justify-between items-center mb-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-300">
                <h1 className="text-xl font-bold text-gray-800">Account Section</h1>
                <div className="flex items-center gap-2 border-l-2 px-5 border-gray-500">
                    <button
                        onClick={handleSubmitProfile(onUpdateProfile)}
                        disabled={isLoading}
                        className="p-2 px-6 flex items-center gap-2 rounded-lg bg-indigo-600 text-white font-medium text-sm cursor-pointer hover:bg-indigo-700 transition-colors disabled:opacity-70"
                    >
                        {isLoading ? (<Loader2 className="animate-spin h-4 w-4" />) : (<Save size={18} />)}
                        <span>Save Profile</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 gap-2">
                <div className="col-span-1 md:col-span-2 xl:col-span-3 2xl:col-span-4">
                    <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <UserRoundPen size={24} /> Profile Setting
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Owner Name</label>
                        <input
                            type="text"
                            {...registerProfile("ownerName")}
                            className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        {profileErrors.ownerName && <p className="text-red-500 text-xs mt-1 ml-1">{profileErrors.ownerName.message}</p>}
                    </div>

                    <div className="cursor-not-allowed opacity-70">
                        <div className="w-full text-gray-500 text-sm mb-1">Email (Read Only)</div>
                        <div className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 text-gray-600 outline-none">
                            {owner?.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <input
                            type="number"
                            {...registerProfile("phoneNumber")}
                            className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        {profileErrors.phoneNumber && <p className="text-red-500 text-xs mt-1 ml-1">{profileErrors.phoneNumber.message}</p>}
                    </div>

                    <div className="cursor-not-allowed opacity-70">
                        <div className="w-full text-gray-500 text-sm mb-1">Pan Number (Read Only)</div>
                        <div className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 text-gray-600 outline-none">
                            {owner?.panNumber}
                        </div>
                    </div>

                    {/* --- PASSWORD SECTION --- */}
                    <div className="col-span-1 md:col-span-2 xl:col-span-3 2xl:col-span-4 border-t border-gray-200 my-2 pt-4">
                        <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <Key size={24} /> Security Settings
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Old Password</label>
                        <input
                            type="password"
                            {...registerPassword("oldPassword")}
                            className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        {passwordErrors.oldPassword && <p className="text-red-500 text-xs mt-1 ml-1">{passwordErrors.oldPassword.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">New Password</label>
                        <input
                            type="password"
                            {...registerPassword("newPassword")}
                            className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1 ml-1">{passwordErrors.newPassword.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            {...registerPassword("confirmPassword")}
                            className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{passwordErrors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleSubmitPassword(onChangePassword)}
                            disabled={isLoading}
                            className="w-full md:w-auto h-[42px] px-6 flex items-center justify-center gap-2 rounded-lg bg-gray-800 text-white font-medium text-sm cursor-pointer hover:bg-gray-900 transition-colors disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Key size={16} />}
                            <span>Change Password</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;