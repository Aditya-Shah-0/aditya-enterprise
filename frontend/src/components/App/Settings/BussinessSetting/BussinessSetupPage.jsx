import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ownerService } from "../../../../services/OwnerService";
import { useForm } from 'react-hook-form';
import { BussinessSetupPageSchema } from "../../../../Schemas/BussinessSetupSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";

import ErrorBoundary from '../../Common/ErrorBoundary';
import BusinessSetupHeader from './BusinessSetupHeader';
import BusinessLogoUploader from './BusinessLogoUploader';
import BusinessDetailsForm from './BusinessDetailsForm';
import AdditionalSettingsForm from './AdditionalSettingsForm';
import SignatureUploader from './SignatureUploader';

const BussinessSetupPage = () => {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { login } = useAuth();

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoDeleted, setLogoDeleted] = useState(false);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [signatureDeleted, setSignatureDeleted] = useState(false);

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(BussinessSetupPageSchema),
        defaultValues: {
            businessName: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            isGstRegistered: "false", // Radio buttons need a valid value immediately
            gstNumber: "",
            panNumber: "",
            businessType: "",
            industryType: "",
            registrationType: "",
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            billingCalculationMode: "rate_based",
        }
    });

    // Fetch Data & Populate Form
    useEffect(() => {
        const getBusinessInfo = async () => {
            try {
                const response = await ownerService.getBusinessInfo();
                const settings = response.businessSettings || {};
                const owner = response.owner || {};

                if (settings.logo) {
                    setLogoPreview(`${BASE_URL}${settings.logo}`);
                } else {
                    setLogoPreview(null);
                }
                if (settings.signature) {
                    setSignaturePreview(`${BASE_URL}${settings.signature}`);
                } else {
                    setSignaturePreview(null);
                }
                setLogoDeleted(false);
                setSignatureDeleted(false);

                // INDUSTRY STANDARD: Data Sanitation
                // If the API returns 'null', we force it to become "" (empty string)
                reset({
                    businessName: settings.businessName || "",
                    phone: String(settings.companyPhone || owner.phone || ""),
                    email: settings.companyEmail || owner.email || "",
                    address: settings.billingAddress || "",
                    city: settings.city || "",
                    state: settings.state || "",
                    pincode: String(settings.pincode || ""),

                    // Handle Boolean -> String for Radios
                    isGstRegistered: settings.isGstRegistered ? "true" : "false",

                    gstNumber: settings.gstNumber || "",
                    panNumber: String(owner.panNumber || ""),
                    businessType: settings.businessType || "",
                    industryType: settings.industryType || "",
                    registrationType: settings.registrationType || "",
                    bankName: settings.bankName || "",
                    accountNumber: String(settings.bankAccountNumber || ""),
                    ifscCode: settings.bankIfscCode || "",
                    billingCalculationMode: settings.billingCalculationMode || "rate_based",
                });

            } catch (error) {
                console.error(error);
                toast.error("Failed to load business information");
            } finally {
                setIsPageLoading(false);
            }
        };
        getBusinessInfo();
    }, [reset]);

    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            const isGst = data.isGstRegistered === "true";
            const formattedData = {
                ...data,
                isGstRegistered: isGst,
                gstNumber: isGst ? data.gstNumber : null
            };
            delete formattedData.panNumber;
            
            // 1. Update text settings
            await ownerService.updateBusinessInfo(formattedData);

            // 2. Upload or delete asset files if selected or deleted
            let updatedSettings = null;
            if (logoFile || signatureFile || logoDeleted || signatureDeleted) {
                const formData = new FormData();
                if (logoFile) {
                    formData.append("logo", logoFile);
                } else if (logoDeleted) {
                    formData.append("deleteLogo", "true");
                }
                if (signatureFile) {
                    formData.append("signature", signatureFile);
                } else if (signatureDeleted) {
                    formData.append("deleteSignature", "true");
                }
                const uploadRes = await ownerService.uploadBusinessAssets(formData);
                updatedSettings = uploadRes.businessSettings;
            }

            await login();
            toast.success("Business information updated successfully");

            if (updatedSettings) {
                if (updatedSettings.logo) {
                    setLogoPreview(`${BASE_URL}${updatedSettings.logo}`);
                } else {
                    setLogoPreview(null);
                }
                if (updatedSettings.signature) {
                    setSignaturePreview(`${BASE_URL}${updatedSettings.signature}`);
                } else {
                    setSignaturePreview(null);
                }
                setLogoFile(null);
                setSignatureFile(null);
                setLogoDeleted(false);
                setSignatureDeleted(false);
            }

        } catch (error) {
            console.error("Update Error:", error);
            toast.error(error.response?.data?.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans rounded-2xl">
            <Toaster />

            {/* HEADER */}
            <ErrorBoundary title="Header Error">
                <BusinessSetupHeader 
                    isSaving={isSaving}
                    onSave={handleSubmit(onSubmit, (error) => console.log("error", error))}
                />
            </ErrorBoundary>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-7 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-300">
                    <ErrorBoundary title="Logo Uploader Error">
                        <BusinessLogoUploader
                            register={register}
                            errors={errors}
                            logoPreview={logoPreview}
                            setLogoFile={setLogoFile}
                            setLogoPreview={setLogoPreview}
                            setLogoDeleted={setLogoDeleted}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary title="Business Details Form Error">
                        <BusinessDetailsForm
                            register={register}
                            errors={errors}
                            watch={watch}
                        />
                    </ErrorBoundary>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-5 space-y-3">
                    <ErrorBoundary title="Additional Settings Form Error">
                        <AdditionalSettingsForm
                            register={register}
                            errors={errors}
                            watch={watch}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary title="Signature Uploader Error">
                        <SignatureUploader
                            signaturePreview={signaturePreview}
                            setSignatureFile={setSignatureFile}
                            setSignaturePreview={setSignaturePreview}
                            setSignatureDeleted={setSignatureDeleted}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default BussinessSetupPage;