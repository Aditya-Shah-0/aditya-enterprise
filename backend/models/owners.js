const mongoose = require('mongoose');
const { toTitleCase } = require('../utils/formatters');

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Owner's Name is required"],
        set: toTitleCase
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },

    phone: {
        type: Number,
        required: [true, "Phone is required"]
    },

    password: {
        type: String,
        length: [6, "Password must be at least 6 characters long"],
        required: [true, "Password is required"]
    },

    panNumber: {
        type: String,
        required: true
    },

    businessSettings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessSettings'
    },

    invoicePreference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvoicePreference'
    },

    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    purchases: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Purchase'
        }
    ],
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    quotations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quotation'
        }
    ],
    partyCredits: [
        {
            partyName: { type: String, required: true },
            advanceBalance: { type: Number, default: 0 }
        }
    ]
})

module.exports = mongoose.model('Owner', ownerSchema);