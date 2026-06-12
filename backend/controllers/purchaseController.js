const purchaseSchema = require("../models/purchaseSchema");
const ownerSchema = require("../models/owners");
const Item = require("../models/itemSchema");

const addPurchase = async (req, res) => {
    try {
        const { ...purchaseData } = req.body;
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
                const purchase = new purchaseSchema({
            userId: owner._id,
            ...purchaseData
        });
        if (purchase.paidAmount > 0) {
            purchase.payments = [{
                amount: purchase.paidAmount,
                date: purchase.date || new Date(),
                paymentMode: purchase.paymentMode || "Cash"
            }];
        }
        purchase.balance = Math.max(0, purchase.grandTotal - (purchase.paidAmount || 0));
        purchase.isPaid = purchase.balance <= 0;
        await purchase.save();
        owner.purchases.push(purchase._id);

        // Auto-sync items to Material Stock
        if (purchaseData.particulars && Array.isArray(purchaseData.particulars)) {
            for (const itemData of purchaseData.particulars) {
                const existingItem = await Item.findOne({ userId: owner._id, name: itemData.name });
                if (existingItem) {
                    existingItem.quantity += Number(itemData.qty || 0);
                    existingItem.purchaseRate = Number(itemData.price || existingItem.purchaseRate);
                    await existingItem.save();
                } else {
                    const newItem = new Item({
                        userId: owner._id,
                        name: itemData.name,
                        category: "General", // Default
                        quantity: Number(itemData.qty || 0),
                        purchaseRate: Number(itemData.price || 0),
                        sellingPrice: Number(itemData.price || 0),
                    });
                    await newItem.save();
                    owner.items.push(newItem._id);
                }
            }
        }

        await owner.save();
        res.status(201).json({ purchase, message: "Successfully added purchase and updated stock" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add purchase" });
    }
};

const getPurchases = async (req, res) => {
    try {
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        const purchases = await purchaseSchema.find({ userId: owner._id });
        res.status(200).json({ purchases, message: "Successfully fetched purchases" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get purchases" });
    }
};

const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMode, date } = req.body;
        const purchase = await purchaseSchema.findById(id);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }
        
        if (amount !== undefined) {
            const payAmount = Number(amount);
            if (isNaN(payAmount) || payAmount <= 0) {
                return res.status(400).json({ error: "Invalid payment amount" });
            }
            purchase.payments.push({
                amount: payAmount,
                date: date ? new Date(date) : new Date(),
                paymentMode: paymentMode || "Cash"
            });
            purchase.paidAmount = purchase.payments.reduce((sum, p) => sum + p.amount, 0);
            purchase.balance = Math.max(0, purchase.grandTotal - purchase.paidAmount);
            purchase.isPaid = purchase.balance <= 0;
        } else {
            const remainingBalance = Math.max(0, purchase.grandTotal - purchase.paidAmount);
            if (remainingBalance > 0) {
                purchase.payments.push({
                    amount: remainingBalance,
                    date: date ? new Date(date) : new Date(),
                    paymentMode: paymentMode || purchase.paymentMode || "Cash"
                });
            }
            purchase.isPaid = true;
            purchase.paidAmount = purchase.grandTotal;
            purchase.balance = 0;
        }

        if (paymentMode) {
            purchase.paymentMode = paymentMode;
        }

        await purchase.save();
        res.status(200).json({ purchase, success: true, message: "Successfully updated purchase payment" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update purchase" });
    }
};

const modifyPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...updateData } = req.body;
        const purchase = await purchaseSchema.findById(id);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        // Check ownership
        if (purchase.userId.toString() !== req.owner.ownerId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        // Reconcile Material Stock quantities:
        // 1. Deduct old purchase quantities from stock
        if (purchase.particulars && Array.isArray(purchase.particulars)) {
            for (const oldItem of purchase.particulars) {
                const existingItem = await Item.findOne({ userId: req.owner.ownerId, name: oldItem.name });
                if (existingItem) {
                    existingItem.quantity = Math.max(0, existingItem.quantity - Number(oldItem.qty || 0));
                    await existingItem.save();
                }
            }
        }

        // 2. Add new purchase quantities to stock
        if (updateData.particulars && Array.isArray(updateData.particulars)) {
            for (const newItem of updateData.particulars) {
                const existingItem = await Item.findOne({ userId: req.owner.ownerId, name: newItem.name });
                if (existingItem) {
                    existingItem.quantity += Number(newItem.qty || 0);
                    existingItem.purchaseRate = Number(newItem.price || existingItem.purchaseRate);
                    await existingItem.save();
                } else {
                    const createdItem = new Item({
                        userId: req.owner.ownerId,
                        name: newItem.name,
                        category: "General",
                        quantity: Number(newItem.qty || 0),
                        purchaseRate: Number(newItem.price || 0),
                        sellingPrice: Number(newItem.price || 0),
                    });
                    await createdItem.save();
                    owner.items.push(createdItem._id);
                }
            }
            await owner.save();
        }

        // Update fields (invoiceNo is locked / read-only)
        purchase.partyName = updateData.partyName;
        purchase.partyAddress = updateData.partyAddress;
        purchase.partyPhone = updateData.partyPhone;
        purchase.date = updateData.date;
        purchase.dueDate = updateData.dueDate;
        purchase.particulars = updateData.particulars;
        purchase.discountPercentage = Number(updateData.discountPercentage) || 0;
        purchase.taxPercentage = Number(updateData.taxPercentage) || 0;

        // Re-calculate totals
        const grandTotal = Number(updateData.grandTotal) || 0;
        const subTotal = Number(updateData.subTotal) || 0;
        const newPaidAmount = Number(updateData.paidAmount) || 0;

        purchase.subTotal = subTotal;
        purchase.grandTotal = grandTotal;
        purchase.paidAmount = newPaidAmount;

        // Adjust payments array to match the new paidAmount
        if (purchase.payments && purchase.payments.length > 0) {
            const otherPaymentsSum = purchase.payments.slice(1).reduce((sum, p) => sum + p.amount, 0);
            const firstPaymentAmount = Math.max(0, newPaidAmount - otherPaymentsSum);
            purchase.payments[0].amount = firstPaymentAmount;
            purchase.payments[0].paymentMode = updateData.paymentMode || purchase.payments[0].paymentMode || "Cash";
            purchase.payments[0].date = updateData.date || purchase.payments[0].date || new Date();
        } else if (newPaidAmount > 0) {
            purchase.payments = [{
                amount: newPaidAmount,
                date: updateData.date || new Date(),
                paymentMode: updateData.paymentMode || "Cash"
            }];
        }

        purchase.balance = Math.max(0, grandTotal - newPaidAmount);
        purchase.isPaid = purchase.balance <= 0;

        await purchase.save();
        res.status(200).json({ purchase, success: true, message: "Successfully modified purchase details and reconciled stock" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to modify purchase" });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus } = req.body;

        if (!["Pending", "Delivered"].includes(deliveryStatus)) {
            return res.status(400).json({ error: "Invalid delivery status value" });
        }

        const purchase = await purchaseSchema.findById(id);
        if (!purchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        if (purchase.userId.toString() !== req.owner.ownerId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        purchase.deliveryStatus = deliveryStatus;
        purchase.deliveryDate = deliveryStatus === "Delivered" ? new Date() : null;
        await purchase.save();

        res.status(200).json({ purchase, success: true, message: "Successfully updated delivery status" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update delivery status" });
    }
};

module.exports = {
    addPurchase,
    getPurchases,
    updatePurchase,
    modifyPurchase,
    updateDeliveryStatus
};
