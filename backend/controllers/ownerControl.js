const Owner = require("../models/owners");
const BusinessSettings = require("../models/bussinessSettingSchema");
const InvoicePreference = require("../models/InvoicePreference");
const Transaction = require("../models/transactionSchema");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

module.exports = {
    updateOwner: async (req, res) => {
        try {
            const owner = await Owner.findById(req.owner.ownerId);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            owner.name = req.body.ownerName;
            owner.phone = req.body.phoneNumber;
            await owner.save();
            res.json({ message: "Owner updated successfully" });
        } catch (error) {
            console.error("Error updating owner:", error);
            res.status(500).json({ message: "Failed to update owner", error });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const owner = await Owner.findById(req.owner.ownerId);
            if (!owner) {
                return res.status(404).json({ message: "Owner not found" });
            }
            const { oldPassword, newPassword } = req.body;
            const isMatch = await bcrypt.compare(oldPassword, owner.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Wrong Password" });
            }
            const salt = bcrypt.genSaltSync(10);
            owner.password = bcrypt.hashSync(newPassword, salt);
            await owner.save();
            res.json({ message: "Password updated successfully" });
        } catch (error) {
            console.error("Error updating password:", error);
            res.status(500).json({ message: "Failed to update password", error });
        }
    },

    updateBusinessInfo: async (req, res) => {
        try {
            const {
                businessName,
                phone,
                email,
                address,
                state,
                pincode,
                city,
                isGstRegistered,
                businessType,
                industryType,
                registrationType,
                gstNumber,
                bankName,
                accountNumber,
                ifscCode,
                billingCalculationMode,
            } = req.body;

            const ownerId = req.owner.ownerId;
            const owner = await Owner.findById(ownerId);

            if (!owner) {
                return res.status(404).json({ message: 'Owner not found' });
            }

            // Check if business settings already exist for this owner
            let businessSettings;
            if (owner.businessSettings) {
                businessSettings = await BusinessSettings.findById(owner.businessSettings);
            }

            if (businessSettings) {
                // Update existing settings
                businessSettings.businessName = businessName;
                businessSettings.companyPhone = phone;
                businessSettings.companyEmail = email;
                businessSettings.billingAddress = address;
                businessSettings.state = state;
                businessSettings.pincode = pincode;
                businessSettings.city = city;
                businessSettings.isGstRegistered = isGstRegistered;
                businessSettings.businessType = businessType;
                businessSettings.industryType = industryType;
                businessSettings.registrationType = registrationType;
                businessSettings.gstNumber = gstNumber;
                businessSettings.bankName = bankName;
                businessSettings.bankAccountNumber = accountNumber;
                businessSettings.bankIfscCode = ifscCode;
                businessSettings.billingCalculationMode = billingCalculationMode || 'rate_based';

                await businessSettings.save();
                res.status(200).json({ message: 'Business settings updated successfully', businessSettings });
            } else {
                // Create new settings
                businessSettings = new BusinessSettings({
                    businessName,
                    companyPhone: phone,
                    companyEmail: email,
                    billingAddress: address,
                    state,
                    pincode,
                    city,
                    isGstRegistered,
                    businessType,
                    industryType,
                    registrationType,
                    gstNumber,
                    bankName,
                    bankAccountNumber: accountNumber,
                    bankIfscCode: ifscCode,
                    billingCalculationMode: billingCalculationMode || 'rate_based',
                    ownerId,
                });

                await businessSettings.save();

                // Link to owner
                owner.businessSettings = businessSettings._id;
                await owner.save();

                res.status(201).json({ message: 'Business settings created successfully', businessSettings });
            }

        } catch (error) {
            console.error('Error updating business info:', error);
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ message: messages.join(', '), error: error });
            }
            res.status(500).json({ message: 'Failed to update business info', error: error });
        }
    },

    getBusinessInfo: async (req, res) => {
        try {
            const ownerId = req.owner.ownerId;
            const owner = await Owner.findById(ownerId).populate('businessSettings');
            const businessSettings = owner.businessSettings;
            res.status(200).json({ businessSettings, owner });
        } catch (error) {
            console.error('Error getting business settings:', error);
            res.status(500).json({ message: 'Failed to get business settings', error: error });
        }
    },

    updateInvoiceSettings: async (req, res) => {
        try {
            const ownerId = req.owner.ownerId;
            const {
                themeColor,
                templateId,
                showLogo,
                showBusinessName,
                showCompanyAddress,
                showItemDescription,
                showSignature,
                customFooterText
            } = req.body;

            const owner = await Owner.findById(ownerId);

            let invoicePreference;
            if (owner.invoicePreference) {
                invoicePreference = await InvoicePreference.findById(owner.invoicePreference);
            }
            if (invoicePreference) {
                invoicePreference.themeColor = themeColor;
                invoicePreference.templateId = templateId;
                invoicePreference.showLogo = showLogo;
                invoicePreference.showBusinessName = showBusinessName;
                invoicePreference.showCompanyAddress = showCompanyAddress;
                invoicePreference.showItemDescription = showItemDescription;
                invoicePreference.showSignature = showSignature;
                invoicePreference.customFooterText = customFooterText;
                await invoicePreference.save();
                res.status(200).json({ message: 'Invoice settings updated successfully', invoicePreference });
            } else {
                invoicePreference = new InvoicePreference({
                    themeColor,
                    templateId,
                    showLogo,
                    showBusinessName,
                    showCompanyAddress,
                    showItemDescription,
                    showSignature,
                    customFooterText,
                    ownerId,
                });
                await invoicePreference.save();
                owner.invoicePreference = invoicePreference._id;
                await owner.save();
                res.status(200).json({ message: 'Invoice settings created successfully', invoicePreference });
            }
        } catch (error) {
            console.error('Error getting invoice settings:', error);
            res.status(500).json({ message: 'Failed to get invoice settings', error: error });
        }
    },

    getInvoiceSettings: async (req, res) => {
        try {
            const ownerId = req.owner.ownerId;
            const owner = await Owner.findById(ownerId).populate('invoicePreference');
            const invoiceSettings = owner.invoicePreference;
            res.status(200).json({ invoiceSettings, owner });
        } catch (error) {
            console.error('Error getting invoice settings:', error);
            res.status(500).json({ message: 'Failed to get invoice settings', error: error });
        }
    },

    uploadBusinessAssets: async (req, res) => {
        try {
            const ownerId = req.owner.ownerId;
            const owner = await Owner.findById(ownerId);
            if (!owner) {
                return res.status(404).json({ message: 'Owner not found' });
            }

            let businessSettings;
            if (owner.businessSettings) {
                businessSettings = await BusinessSettings.findById(owner.businessSettings);
            }

            if (!businessSettings) {
                return res.status(400).json({ message: 'Please set up business info first' });
            }

            // Handle uploaded logo
            if (req.body.deleteLogo === 'true') {
                if (businessSettings.logo) {
                    const oldPath = path.join(__dirname, '../public', businessSettings.logo);
                    if (fs.existsSync(oldPath)) {
                        try {
                            fs.unlinkSync(oldPath);
                        } catch (err) {
                            console.error("Failed to delete old logo file:", err);
                        }
                    }
                }
                businessSettings.logo = null;
            } else if (req.files && req.files.logo && req.files.logo[0]) {
                const logoFile = req.files.logo[0];
                // If old logo exists, delete it
                if (businessSettings.logo) {
                    const oldPath = path.join(__dirname, '../public', businessSettings.logo);
                    if (fs.existsSync(oldPath)) {
                        try {
                            fs.unlinkSync(oldPath);
                        } catch (err) {
                            console.error("Failed to delete old logo file:", err);
                        }
                    }
                }
                businessSettings.logo = `/uploads/${logoFile.filename}`;
            }

            // Handle uploaded signature
            if (req.body.deleteSignature === 'true') {
                if (businessSettings.signature) {
                    const oldPath = path.join(__dirname, '../public', businessSettings.signature);
                    if (fs.existsSync(oldPath)) {
                        try {
                            fs.unlinkSync(oldPath);
                        } catch (err) {
                            console.error("Failed to delete old signature file:", err);
                        }
                    }
                }
                businessSettings.signature = null;
            } else if (req.files && req.files.signature && req.files.signature[0]) {
                const signatureFile = req.files.signature[0];
                // If old signature exists, delete it
                if (businessSettings.signature) {
                    const oldPath = path.join(__dirname, '../public', businessSettings.signature);
                    if (fs.existsSync(oldPath)) {
                        try {
                            fs.unlinkSync(oldPath);
                        } catch (err) {
                            console.error("Failed to delete old signature file:", err);
                        }
                    }
                }
                businessSettings.signature = `/uploads/${signatureFile.filename}`;
            }

            await businessSettings.save();
            res.status(200).json({ message: 'Business assets updated successfully', businessSettings });
        } catch (error) {
            console.error('Error uploading business assets:', error);
            res.status(500).json({ message: error.message || 'Failed to upload business assets' });
        }
    },
}