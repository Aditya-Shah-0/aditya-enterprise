import React from 'react';

const BusinessDetailsForm = ({ register, errors, watch }) => {
    const isGstRegistered = watch("isGstRegistered");

    return (
        <>
            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Company Phone</label>
                    <input 
                        type="number" 
                        {...register("phone")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800" 
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Company E-Mail</label>
                    <input 
                        type="email" 
                        {...register("email")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800" 
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
            </div>

            {/* ADDRESS */}
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-500 mb-1">Billing Address</label>
                <textarea 
                    {...register("address")} 
                    rows="3" 
                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800 resize-none"
                ></textarea>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                    <input 
                        type="text" 
                        {...register("state")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800" 
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                    <input 
                        type="number" 
                        {...register("pincode")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800" 
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <input 
                    type="text" 
                    {...register("city")} 
                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800" 
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>

            {/* GST SECTION */}
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-2">Are you GST Registered?</label>
                <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${isGstRegistered === "true" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <span className="text-sm font-medium text-gray-700">Yes</span>
                        <input type="radio" value="true" {...register("isGstRegistered")} className="w-4 h-4 accent-blue-600" />
                    </label>

                    <label className={`flex-1 flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${isGstRegistered === "false" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <span className="text-sm font-medium text-gray-700">No</span>
                        <input type="radio" value="false" {...register("isGstRegistered")} className="w-4 h-4 accent-blue-600" />
                    </label>
                </div>
                {errors.isGstRegistered && <p className="text-red-500 text-xs mt-1">{errors.isGstRegistered.message}</p>}
            </div>

            {isGstRegistered === "false" ? (
                <div className="mb-4 opacity-80" key="pan-section">
                    <label className="block text-sm font-medium text-gray-500 mb-1">PAN Number (Read Only)</label>
                    <input
                        disabled
                        {...register("panNumber")}
                        className="w-full p-2.5 border border-gray-300 rounded bg-gray-100 text-gray-600 outline-none uppercase cursor-not-allowed"
                    />
                </div>
            ) : (
                <div className="mb-4" key="gst-section">
                    <label className="block text-sm font-medium text-gray-500 mb-1">GST Number</label>
                    <input
                        type="text"
                        {...register("gstNumber")}
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800 uppercase"
                        placeholder="Enter GST Number"
                    />
                    {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message}</p>}
                </div>
            )}
        </>
    );
};

export default BusinessDetailsForm;
