import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import InvoicePreview1 from './InvoicePreview1';
import InvoicePreview2 from './InvoicePreview2';
import InvoicePreview3 from './InvoicePreview3';
import InvoicePreview4 from './InvoicePreview4';
import { Save, LayoutTemplate } from 'lucide-react';
import Toggle from './Toggle';
import { useForm } from 'react-hook-form';
import { invoiceSettingSchema } from '../../../../Schemas/InvoiceSettingSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerService } from '../../../../services/OwnerService';
import toast, { Toaster } from 'react-hot-toast';

const InvoiceSettings = () => {
    const { owner } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (owner && !owner.businessSettings) {
            toast.error("Please complete your business setup first.");
            navigate('/settings/bussinessSetup', { replace: true });
        }
    }, [owner, navigate]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(invoiceSettingSchema),
        defaultValues: {
            themeColor: '#2563EB',
            templateId: 'bold',
            showLogo: true,
            showBusinessName: true,
            showCompanyAddress: true,
            showItemDescription: true,
            showSignature: true,
            customFooterText: 'Thank you for your business!',
        }

    });

    const settings = watch();

    const sampleData = {
        invoiceNo: 'INV-2025-001',
        date: '2025-10-24',
        partyName: 'Aditya Shah',
        partyAddress: '123 Main St, Anytown, USA',
        stateOfSupply: 'Maharashtra',
        gstNumber: '18CCDVD5185ZEA',
        particulars: [
            { name: 'Samsung Monitor', description: '24 inch curved', qty: 1, price: 12000 },
            { name: 'Logitech Mouse', description: 'Wireless silent', qty: 2, price: 800 },
        ],
        subTotal: 13600,
        discountPercentage: 0,
        taxPercentage: 18,
        grandTotal: 16048,
        term: "Net 3",
        paymentMode: 'Online Payment',
        paidAmount: 10640,
        balance: 5408,
        isPaid: false,
        dueDate: '2025-10-24',
    };

    //useeffect
    useEffect(() => {
        const getInvoiceSettings = async () => {
            try {
                const response = await ownerService.getInvoiceSettings();
                const settingsData = response?.invoiceSettings;
                if (settingsData) {
                    setValue('themeColor', settingsData.themeColor || '#2563EB');
                    setValue('templateId', settingsData.templateId || 'bold');
                    setValue('showLogo', settingsData.showLogo !== undefined ? settingsData.showLogo : true);
                    setValue('showBusinessName', settingsData.showBusinessName !== undefined ? settingsData.showBusinessName : true);
                    setValue('showCompanyAddress', settingsData.showCompanyAddress !== undefined ? settingsData.showCompanyAddress : true);
                    setValue('showItemDescription', settingsData.showItemDescription !== undefined ? settingsData.showItemDescription : true);
                    setValue('showSignature', settingsData.showSignature !== undefined ? settingsData.showSignature : true);
                    setValue('customFooterText', settingsData.customFooterText || 'Thank you for your business!');
                }
            } catch (err) {
                console.error("Failed to load invoice settings", err);
                toast.error("Failed to load invoice settings. Using default configurations.");
            }
        }
        getInvoiceSettings();
    }, [setValue]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValue(name, type === 'checkbox' ? checked : value);
    };

    const oninvoiceSubmit = async (data) => {
        try {
            await ownerService.updateInvoiceSettings(data);
            toast.success('Invoice Settings Updated Successfully');
        } catch (error) {
            console.error("Failed to update invoice settings", error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden rounded-2xl">

            <Toaster />

            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-50/50">
                <div className="scale-[0.85] origin-top shadow-stone-500">
                    {settings.templateId === 'standard' && <InvoicePreview1 settings={settings} data={sampleData} />}
                    {settings.templateId === 'table' && <InvoicePreview2 settings={settings} data={sampleData} />}
                    {settings.templateId === 'bold' && <InvoicePreview3 settings={settings} data={sampleData} />}
                    {settings.templateId === 'rounded' && <InvoicePreview4 settings={settings} data={sampleData} />}
                </div>
            </div>

            <div className="w-full lg:w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col h-full">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Invoice Customization</h2>
                    <p className="text-sm text-gray-500">Real-time preview</p>
                </div>

                <div className="flex-col overflow-y-auto px-6 py-4 space-y-8">

                    {/* TEMPLATE SELECTOR */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <LayoutTemplate size={24} /> Template
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'standard', name: 'Standard' },
                                { id: 'table', name: 'Table / Classic' },
                                { id: 'bold', name: 'Bold Watermark' },
                                { id: 'rounded', name: 'Rounded Modern' }
                            ].map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setValue('templateId', template.id)}
                                    className={`p-3 text-xs font-medium rounded-lg border-2 transition-all text-center ${settings.templateId === template.id
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Theme Color</h3>
                        <div className="flex gap-3">
                            {['#2563EB', '#DC2626', '#16A34A', '#9333EA', '#000000'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setValue('themeColor', color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${settings.themeColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Display Options</h3>
                        <Toggle label="Show Logo" name="showLogo" checked={settings.showLogo} onChange={handleChange} />
                        <Toggle label="Business Name" name="showBusinessName" checked={settings.showBusinessName} onChange={handleChange} />
                        <Toggle label="Company Address" name="showCompanyAddress" checked={settings.showCompanyAddress} onChange={handleChange} />
                        <Toggle label="Item Descriptions" name="showItemDescription" checked={settings.showItemDescription} onChange={handleChange} />
                        <Toggle label="Authorized Signature" name="showSignature" checked={settings.showSignature} onChange={handleChange} />
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Footer Note</h3>
                        <textarea
                            name="customFooterText"
                            {...register('customFooterText')}
                            className="text-black w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                        />
                    </section>
                </div>

                <div className="p-6 border-t border-gray-300 bg-gray-50">
                    <button
                        onClick={handleSubmit(oninvoiceSubmit)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Save size={22} />
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSettings;
