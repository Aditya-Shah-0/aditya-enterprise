const mongoose = require('mongoose');

const invoicePreferenceSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
        unique: true // One preference set per user
    },

    // Visuals
    themeColor: { type: String, default: '#2563EB' }, // Default Blue
    templateId: { type: String, default: 'bold' },  // classic, modern, bold

    // Header Toggles
    showLogo: { type: Boolean, default: true },
    showBusinessName: { type: Boolean, default: true },
    showCompanyAddress: { type: Boolean, default: true },

    // Item Table Toggles
    showItemDescription: { type: Boolean, default: true },

    // Footer Toggles
    showSignature: { type: Boolean, default: true },
    customFooterText: { type: String, default: "Thank you for your business!" }

}, { timestamps: true });

module.exports = mongoose.model('InvoicePreference', invoicePreferenceSchema);