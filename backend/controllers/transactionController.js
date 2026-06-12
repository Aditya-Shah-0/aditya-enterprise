const transactionSchema = require("../models/transactionSchema");
const ownerSchema = require("../models/owners");

const addTransaction = async (req, res) => {
    try {
        const { ...transactionData } = req.body;
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        const transaction = new transactionSchema({
            userId: owner._id,
            ...transactionData
        });
        if (transaction.paidAmount > 0) {
            transaction.payments = [{
                amount: transaction.paidAmount,
                date: transaction.date || new Date(),
                paymentMode: transaction.paymentMode || "Cash"
            }];
        }
        transaction.balance = Math.max(0, transaction.grandTotal - (transaction.paidAmount || 0));
        transaction.isPaid = transaction.balance <= 0;
        await transaction.save();
        owner.transactions.push(transaction._id);
        await owner.save();
        res.status(201).json({ transaction, message: "successFully added transaction" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add transaction" });
    }
};

const getTransactions = async (req, res) => {
    try {
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        const transactions = await transactionSchema.find({ userId: owner._id });
        res.status(200).json({ transactions, message: "successFully get transactions" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get transactions" });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMode, date } = req.body;
        const transaction = await transactionSchema.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (amount !== undefined) {
            const payAmount = Number(amount);
            if (isNaN(payAmount) || payAmount <= 0) {
                return res.status(400).json({ error: "Invalid payment amount" });
            }
            transaction.payments.push({
                amount: payAmount,
                date: date ? new Date(date) : new Date(),
                paymentMode: paymentMode || "Cash"
            });
            transaction.paidAmount = transaction.payments.reduce((sum, p) => sum + p.amount, 0);
            transaction.balance = Math.max(0, transaction.grandTotal - transaction.paidAmount);
            transaction.isPaid = transaction.balance <= 0;
        } else {
            const remainingBalance = Math.max(0, transaction.grandTotal - transaction.paidAmount);
            if (remainingBalance > 0) {
                transaction.payments.push({
                    amount: remainingBalance,
                    date: date ? new Date(date) : new Date(),
                    paymentMode: paymentMode || transaction.paymentMode || "Cash"
                });
            }
            transaction.isPaid = true;
            transaction.paidAmount = transaction.grandTotal;
            transaction.balance = 0;
        }

        if (paymentMode) {
            transaction.paymentMode = paymentMode;
        }

        await transaction.save();
        res.status(200).json({ transaction, success: true, message: "Successfully updated transaction payment" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
};

const modifyTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...updateData } = req.body;
        const transaction = await transactionSchema.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Check ownership
        if (transaction.userId.toString() !== req.owner.ownerId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        // Update fields (invoiceNo is locked / read-only)
        transaction.partyName = updateData.partyName;
        transaction.partyAddress = updateData.partyAddress;
        transaction.partyPhone = updateData.partyPhone;
        transaction.date = updateData.date;
        transaction.dueDate = updateData.dueDate;
        transaction.stateOfSupply = updateData.stateOfSupply;
        transaction.particulars = updateData.particulars;
        transaction.discountPercentage = Number(updateData.discountPercentage) || 0;
        transaction.taxPercentage = Number(updateData.taxPercentage) || 0;
        transaction.term = updateData.term;

        // Re-calculate totals
        const grandTotal = Number(updateData.grandTotal) || 0;
        const subTotal = Number(updateData.subTotal) || 0;
        const newPaidAmount = Number(updateData.paidAmount) || 0;

        transaction.subTotal = subTotal;
        transaction.grandTotal = grandTotal;
        transaction.paidAmount = newPaidAmount;

        // Adjust payments array to match the new paidAmount
        if (transaction.payments && transaction.payments.length > 0) {
            const otherPaymentsSum = transaction.payments.slice(1).reduce((sum, p) => sum + p.amount, 0);
            const firstPaymentAmount = Math.max(0, newPaidAmount - otherPaymentsSum);
            transaction.payments[0].amount = firstPaymentAmount;
            transaction.payments[0].paymentMode = updateData.paymentMode || transaction.payments[0].paymentMode || "Cash";
            transaction.payments[0].date = updateData.date || transaction.payments[0].date || new Date();
        } else if (newPaidAmount > 0) {
            transaction.payments = [{
                amount: newPaidAmount,
                date: updateData.date || new Date(),
                paymentMode: updateData.paymentMode || "Cash"
            }];
        }

        transaction.balance = Math.max(0, grandTotal - newPaidAmount);
        transaction.isPaid = transaction.balance <= 0;

        await transaction.save();
        res.status(200).json({ transaction, success: true, message: "Successfully modified transaction details" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to modify transaction" });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus } = req.body;

        if (!["Pending", "Delivered"].includes(deliveryStatus)) {
            return res.status(400).json({ error: "Invalid delivery status value" });
        }

        const transaction = await transactionSchema.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (transaction.userId.toString() !== req.owner.ownerId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        transaction.deliveryStatus = deliveryStatus;
        transaction.deliveryDate = deliveryStatus === "Delivered" ? new Date() : null;
        await transaction.save();

        res.status(200).json({ transaction, success: true, message: "Successfully updated delivery status" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update delivery status" });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    modifyTransaction,
    updateDeliveryStatus
};
