const mongoose = require("mongoose");
const { toTitleCase } = require("../utils/formatters");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true,
        set: toTitleCase
    },
    description: {
        type: String,
        trim: true,
        set: toTitleCase
    },
    qty: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    amount: {
        type: Number,
        required: true
    }
}, { _id: false });

const QuotationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
        index: true
    },

    partyName: {
        type: String,
        required: [true, "Party name is required"],
        trim: true,
        index: true,
        set: toTitleCase
    },
    partyAddress: {
        type: String,
        trim: true,
        set: toTitleCase
    },
    partyPhone: {
        type: String,
        trim: true
    },

    quotationNo: {
        type: String,
        required: [true, "Quotation number is required"],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    stateOfSupply: {
        type: String,
        trim: true
    },

    particulars: [ItemSchema],

    subTotal: {
        type: Number,
        required: true,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    taxPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    grandTotal: {
        type: Number,
        required: true,
        default: 0
    },

    status: {
        type: String,
        enum: ["Draft", "Sent", "Accepted", "Declined", "Invoiced"],
        default: "Draft"
    },
    customFooterText: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

QuotationSchema.index({ userId: 1, quotationNo: 1 }, { unique: true });

module.exports = mongoose.model("Quotation", QuotationSchema);
