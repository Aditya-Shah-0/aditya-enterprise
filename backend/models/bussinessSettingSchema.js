const mongoose = require('mongoose');
const { toTitleCase } = require('../utils/formatters');

const businessSettingsSchema = new mongoose.Schema({
    logo: {
        type: String,
        default: null
    },

    businessName: {
        type: String,
        required: [true, "Business Name is required"],
        trim: true,
        set: toTitleCase
    },

    companyPhone: {
        type: String,
        required: [true, "Company Phone is required"],
        trim: true
    },

    companyEmail: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },

    billingAddress: {
        type: String,
        trim: true,
        set: toTitleCase
    },

    state: { type: String, required: [true, "State is required"], set: toTitleCase },
    pincode: { type: String, required: [true, "Pincode is required"] },
    city: { type: String, required: [true, "City is required"], set: toTitleCase },

    isGstRegistered: {
        type: Boolean,
        default: false
    },

    businessType: {
        type: String,
    },

    industryType: {
        type: String
    },

    registrationType: {
        type: String,
        default: "Private Limited Company"
    },

    gstNumber: {
        type: String,
        default: null
    },

    bankName: {
        type: String,
        default: null,
        set: toTitleCase
    },

    bankAccountNumber: {
        type: String,
        default: null
    },

    bankIfscCode: {
        type: String,
        default: null
    },

    signature: {
        type: String,
        default: null
    },

    billingCalculationMode: {
        type: String,
        enum: ['rate_based', 'amount_based'],
        default: 'rate_based'
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: [true, "Owner ID is required"]
    }
});

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema); 