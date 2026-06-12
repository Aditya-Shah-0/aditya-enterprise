import React from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const BusinessLogoUploader = ({
    register,
    errors,
    logoPreview,
    setLogoFile,
    setLogoPreview,
    setLogoDeleted
}) => {
    return (
        <div className="flex items-center gap-4 mb-3">
            <div className="relative w-32 h-32 shrink-0 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group overflow-hidden flex items-center justify-center">
                {logoPreview ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('logoInput').click();
                                }}
                                className="p-1.5 bg-white rounded-full hover:bg-gray-100 text-gray-800 transition-transform hover:scale-110"
                                title="Change Logo"
                            >
                                <Upload size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLogoFile(null);
                                    setLogoPreview(null);
                                    setLogoDeleted(true);
                                }}
                                className="p-1.5 bg-red-600 rounded-full hover:bg-red-700 text-white transition-transform hover:scale-110"
                                title="Remove Logo"
                            >
                                <span className="text-xs font-bold leading-none block px-1">✕</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => document.getElementById('logoInput').click()}
                        className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                    >
                        <Upload className="text-gray-400 mb-1" size={24} />
                        <span className="text-[11px] font-bold text-gray-500">Upload Logo</span>
                        <span className="text-[9px] text-gray-400">PNG, JPG (Max 2MB)</span>
                    </div>
                )}
                <input
                    id="logoInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                                toast.error("File size must be less than 2MB");
                                return;
                            }
                            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                            if (!allowedTypes.includes(file.type)) {
                                toast.error("Only PNG, JPG, and JPEG images are allowed");
                                return;
                            }
                            setLogoFile(file);
                            setLogoPreview(URL.createObjectURL(file));
                            setLogoDeleted(false);
                        }
                    }}
                />
            </div>

            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Business Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register("businessName")}
                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                    placeholder="Enter Business Name"
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
            </div>
        </div>
    );
};

export default BusinessLogoUploader;
