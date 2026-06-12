import React from 'react';

const AdditionalSettingsForm = ({ register, errors, watch }) => {
    const billingCalculationMode = watch("billingCalculationMode");

    return (
        <div className="space-y-3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                {/* BUSINESS TYPE & INDUSTRY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
                        <select {...register("businessType")} className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500">
                            <option value="">Select Business Type</option>
                            <option value="Retail">Retail</option>
                            <option value="Wholesale">Wholesale</option>
                            <option value="Services">Services</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Freelancer">Freelancer / Sole Proprietor</option>
                            <option value="IT & Software">IT & Software</option>
                            <option value="Food & Beverage">Food & Beverage (F&B)</option>
                            <option value="Healthcare & Medical">Healthcare & Medical</option>
                            <option value="Construction & Real Estate">Construction & Real Estate</option>
                            <option value="Logistics & Transport">Logistics & Transport</option>
                            <option value="Education & Training">Education & Training</option>
                            <option value="Travel & Tourism">Travel & Tourism</option>
                            <option value="Agriculture & Farming">Agriculture & Farming</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Media & Entertainment">Media & Entertainment</option>
                            <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Industry Type</label>
                        <select {...register("industryType")} className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500">
                            <option value="">Select Industry Type</option>
                            <option value="Agriculture">Agriculture & Farming</option>
                            <option value="Automotive">Automotive & Garage</option>
                            <option value="Banking">Banking & Finance</option>
                            <option value="Construction">Construction & Interior</option>
                            <option value="Education">Education & Coaching</option>
                            <option value="Electronics">Electronics & Hardware</option>
                            <option value="Fashion">Fashion & Apparels</option>
                            <option value="FMCG">FMCG & Groceries (Kirana)</option>
                            <option value="Food">Food, Restaurants & Cafe</option>
                            <option value="Healthcare">Healthcare & Pharmacy</option>
                            <option value="IT">IT, Software & Telecom</option>
                            <option value="Jewelry">Jewelry & Accessories</option>
                            <option value="Manufacturing">Manufacturing & Industrial</option>
                            <option value="Media">Media & Entertainment</option>
                            <option value="Printing">Printing, Publishing & Stationery</option>
                            <option value="RealEstate">Real Estate</option>
                            <option value="Sports">Sports & Fitness</option>
                            <option value="Transport">Transportation & Logistics</option>
                            <option value="Travel">Travel & Hospitality</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.industryType && <p className="text-red-500 text-xs mt-1">{errors.industryType.message}</p>}
                    </div>
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Registration Type</label>
                    <select {...register("registrationType")} className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-800 outline-none focus:border-blue-500">
                        <option value="">Select Registration Type</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership Firm">Partnership Firm</option>
                        <option value="LLP">Limited Liability Partnership (LLP)</option>
                        <option value="Private Limited">Private Limited Company (Pvt Ltd)</option>
                        <option value="Public Limited">Public Limited Company</option>
                        <option value="OPC">One Person Company (OPC)</option>
                        <option value="Section 8">Section 8 Company (NGO/Non-Profit)</option>
                        <option value="HUF">Hindu Undivided Family (HUF)</option>
                        <option value="Trust">Trust / Society</option>
                        <option value="Unregistered">Unregistered / Individual</option>
                    </select>
                </div>

                <div className="mb-2 mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Billing Calculation Preference</label>
                    <div className="flex flex-col gap-2">
                        <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${billingCalculationMode === "rate_based" ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
                            <input type="radio" value="rate_based" {...register("billingCalculationMode")} className="accent-indigo-600 mt-1" />
                            <div>
                                <div className="text-sm font-bold text-gray-850">Direct Selling (Rate-based)</div>
                                <div className="text-[11px] text-gray-500 font-medium leading-relaxed">Input Quantity & Rate per piece. Amount is auto-calculated. (Retail/Wholesale standard)</div>
                            </div>
                        </label>
                        <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${billingCalculationMode === "amount_based" ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
                            <input type="radio" value="amount_based" {...register("billingCalculationMode")} className="accent-indigo-600 mt-1" />
                            <div>
                                <div className="text-sm font-bold text-gray-850">Custom Manufacturing (Amount-based)</div>
                                <div className="text-[11px] text-gray-500 font-medium leading-relaxed">Input Quantity & Total Amount. Per-piece Rate is auto-calculated. (Job Work standard)</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* BANKING DETAILS */}
            <div className="bg-white py-3 px-6 rounded-lg shadow-sm border border-gray-300 flex flex-col gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bank Name</label>
                    <input 
                        type='text' 
                        {...register("bankName")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800 text-sm" 
                    />
                    {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                    <input 
                        type='number' 
                        {...register("accountNumber")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800 text-sm" 
                    />
                    {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">IFSC Code</label>
                    <input 
                        type='text' 
                        {...register("ifscCode")} 
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-blue-500 outline-none text-gray-800 text-sm" 
                    />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdditionalSettingsForm;
