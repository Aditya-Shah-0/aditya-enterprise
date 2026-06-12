import React from 'react';
import { Upload, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const SignatureUploader = ({
    signaturePreview,
    setSignatureFile,
    setSignaturePreview,
    setSignatureDeleted
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-gray-500">Authorized Signature</label>
            <div className="relative w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all cursor-pointer group overflow-hidden flex items-center justify-center">
                {signaturePreview ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                        <img src={signaturePreview} alt="Signature Preview" className="max-w-full max-h-full object-contain p-2" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('signatureInput').click();
                                }}
                                className="p-1.5 bg-white rounded-full hover:bg-gray-100 text-gray-800 transition-transform hover:scale-110"
                                title="Change Signature"
                            >
                                <Upload size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSignatureFile(null);
                                    setSignaturePreview(null);
                                    setSignatureDeleted(true);
                                }}
                                className="p-1.5 bg-red-600 rounded-full hover:bg-red-700 text-white transition-transform hover:scale-110"
                                title="Remove Signature"
                            >
                                <span className="text-xs font-bold leading-none block px-1">✕</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => document.getElementById('signatureInput').click()}
                        className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                    >
                        <Plus className="text-gray-400 mb-1" size={24} />
                        <span className="text-xs font-semibold text-gray-500">Upload Signature</span>
                        <span className="text-[10px] text-gray-400">PNG, JPG (Max 2MB)</span>
                    </div>
                )}
                <input
                    id="signatureInput"
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
                            setSignatureFile(file);
                            setSignaturePreview(URL.createObjectURL(file));
                            setSignatureDeleted(false);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default SignatureUploader;
