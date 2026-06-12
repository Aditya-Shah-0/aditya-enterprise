const mongoose = require("mongoose");
const { toTitleCase } = require("../utils/formatters");

const PurchaseItemSchema = new mongoose.Schema({
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

const PaymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0, "Payment amount cannot be negative"]
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Online Payment", "Cheque", "Other"],
        default: "Cash"
    }
}, { _id: false });

const PurchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
        index: true
    },
    partyName: {
        type: String,
        required: [true, "Vendor name is required"],
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
    gstNumber: {
        type: String,
        trim: true
    },
    invoiceNo: {
        type: String,
        required: [true, "Invoice/Bill number is required"],
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
    particulars: [PurchaseItemSchema],
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
    paymentMode: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Online Payment", "Cheque", "Other"],
        default: "Cash"
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    payments: [PaymentSchema],
    deliveryStatus: {
        type: String,
        enum: ["Pending", "Delivered"],
        default: "Pending"
    },
    deliveryDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

PurchaseSchema.index({ userId: 1, invoiceNo: 1 }, { unique: true });

module.exports = mongoose.model("Purchase", PurchaseSchema);
