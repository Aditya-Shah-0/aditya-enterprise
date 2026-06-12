const mongoose = require("mongoose");
const { toTitleCase } = require("../utils/formatters");

const ItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true,
        set: toTitleCase
    },
    category: {
        type: String,
        default: "General",
        trim: true,
        set: toTitleCase
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, "Quantity cannot be negative"]
    },
    unit: {
        type: String,
        default: "pcs",
        trim: true
    },
    purchaseRate: {
        type: Number,
        default: 0,
        min: [0, "Purchase rate cannot be negative"]
    },
    sellingPrice: {
        type: Number,
        default: 0,
        min: [0, "Selling price cannot be negative"]
    },
    hsnCode: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Ensure item names are unique per user
ItemSchema.index({ userId: 1, name: 1 }, { unique: true });

// Virtual property for stock status
ItemSchema.virtual('status').get(function() {
    if (this.quantity === 0) return 'Out of Stock';
    if (this.quantity > 0 && this.quantity <= 10) return 'Low Stock';
    return 'In Stock';
});

// Ensure virtuals are included in JSON/Object conversions
ItemSchema.set('toJSON', { virtuals: true });
ItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Item", ItemSchema);
