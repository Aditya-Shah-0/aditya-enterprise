const transactionSchema = require("../models/transactionSchema");
const ownerSchema = require("../models/owners");
const Item = require("../models/itemSchema");
const purchaseSchema = require("../models/purchaseSchema");

const addTransaction = async (req, res) => {
    try {
        const { appliedCredit, ...transactionData } = req.body;
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        let creditPaid = 0;
        if (appliedCredit && Number(appliedCredit) > 0) {
            const creditToApply = Number(appliedCredit);
            let creditEntry = owner.partyCredits?.find(c => c.partyName.toLowerCase() === transactionData.partyName.toLowerCase());
            if (creditEntry && creditEntry.advanceBalance >= creditToApply) {
                creditEntry.advanceBalance -= creditToApply;
                creditPaid = creditToApply;
            }
        }

        const transaction = new transactionSchema({
            userId: owner._id,
            ...transactionData
        });

        transaction.payments = [];
        if (creditPaid > 0) {
            transaction.payments.push({
                amount: creditPaid,
                date: transactionData.date || new Date(),
                paymentMode: "Advance Credit"
            });
        }
        if (transaction.paidAmount > 0) {
            transaction.payments.push({
                amount: transaction.paidAmount,
                date: transactionData.date || new Date(),
                paymentMode: transactionData.paymentMode || "Cash"
            });
        }

        transaction.paidAmount = (transaction.paidAmount || 0) + creditPaid;
        transaction.balance = Math.max(0, transaction.grandTotal - transaction.paidAmount);
        transaction.isPaid = transaction.balance <= 0;
        await transaction.save();
        owner.transactions.push(transaction._id);

        // Auto-sync items to Material Stock (Deduct on Sale)
        if (transactionData.particulars && Array.isArray(transactionData.particulars)) {
            for (const itemData of transactionData.particulars) {
                const existingItem = await Item.findOne({ userId: owner._id, name: itemData.name });
                if (existingItem) {
                    existingItem.quantity = Math.max(0, existingItem.quantity - Number(itemData.qty || 0));
                    await existingItem.save();
                }
            }
        }

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

        // Reconcile Material Stock quantities:
        // 1. Add back old transaction quantities to stock
        if (transaction.particulars && Array.isArray(transaction.particulars)) {
            for (const oldItem of transaction.particulars) {
                const existingItem = await Item.findOne({ userId: req.owner.ownerId, name: oldItem.name });
                if (existingItem) {
                    existingItem.quantity += Number(oldItem.qty || 0);
                    await existingItem.save();
                }
            }
        }

        // 2. Deduct new transaction quantities from stock
        if (updateData.particulars && Array.isArray(updateData.particulars)) {
            for (const newItem of updateData.particulars) {
                const existingItem = await Item.findOne({ userId: req.owner.ownerId, name: newItem.name });
                if (existingItem) {
                    existingItem.quantity = Math.max(0, existingItem.quantity - Number(newItem.qty || 0));
                    await existingItem.save();
                }
            }
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

const recordBulkPayment = async (req, res) => {
    try {
        const { partyName, amount, paymentMode, date, type } = req.body;
        const paymentAmount = Number(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ error: "Invalid payment amount" });
        }
        if (!partyName) {
            return res.status(400).json({ error: "Party name is required" });
        }
        if (!["sale", "purchase"].includes(type)) {
            return res.status(400).json({ error: "Invalid payment type" });
        }

        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        let remaining = paymentAmount;

        if (type === "sale") {
            const transactions = await transactionSchema.find({ userId: owner._id, partyName: partyName, isPaid: false }).sort({ date: 1 });
            for (const txn of transactions) {
                if (remaining <= 0) break;
                const billBalance = txn.grandTotal - txn.paidAmount;
                const applied = Math.min(remaining, billBalance);

                txn.payments.push({
                    amount: applied,
                    date: date ? new Date(date) : new Date(),
                    paymentMode: paymentMode || "Cash"
                });
                txn.paidAmount += applied;
                txn.balance = Math.max(0, txn.grandTotal - txn.paidAmount);
                txn.isPaid = txn.balance <= 0;
                await txn.save();
                remaining -= applied;
            }
        } else {
            const purchases = await purchaseSchema.find({ userId: owner._id, partyName: partyName, isPaid: false }).sort({ date: 1 });
            for (const pur of purchases) {
                if (remaining <= 0) break;
                const billBalance = pur.grandTotal - pur.paidAmount;
                const applied = Math.min(remaining, billBalance);

                pur.payments.push({
                    amount: applied,
                    date: date ? new Date(date) : new Date(),
                    paymentMode: paymentMode || "Cash"
                });
                pur.paidAmount += applied;
                pur.balance = Math.max(0, pur.grandTotal - pur.paidAmount);
                pur.isPaid = pur.balance <= 0;
                await pur.save();
                remaining -= applied;
            }
        }

        // Save leftover to advance credits
        if (remaining > 0) {
            if (!owner.partyCredits) {
                owner.partyCredits = [];
            }
            let creditEntry = owner.partyCredits.find(c => c.partyName.toLowerCase() === partyName.toLowerCase());
            if (creditEntry) {
                creditEntry.advanceBalance += remaining;
            } else {
                owner.partyCredits.push({ partyName, advanceBalance: remaining });
            }
            await owner.save();
        }

        res.status(200).json({ success: true, remainingLeftover: remaining, message: "Bulk payment applied successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to apply bulk payment" });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    modifyTransaction,
    updateDeliveryStatus,
    recordBulkPayment
};
