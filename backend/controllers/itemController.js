const Item = require("../models/itemSchema");
const Owner = require("../models/owners");

const addItem = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const owner = await Owner.findById(ownerId);
        
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        const { name, category, quantity, unit, purchaseRate, sellingPrice, hsnCode } = req.body;

        // Check if item with same name exists
        const existingItem = await Item.findOne({ userId: ownerId, name });
        if (existingItem) {
            return res.status(400).json({ error: "Item with this name already exists in your stock" });
        }

        const item = new Item({
            userId: ownerId,
            name,
            category,
            quantity,
            unit,
            purchaseRate,
            sellingPrice,
            hsnCode
        });

        await item.save();

        owner.items.push(item._id);
        await owner.save();

        res.status(201).json({ item, message: "Item successfully added to stock" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add item to stock" });
    }
};

const getItems = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const items = await Item.find({ userId: ownerId }).sort({ createdAt: -1 });
        res.status(200).json({ items, message: "Items fetched successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get items" });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.owner.ownerId;
        
        const item = await Item.findOne({ _id: id, userId: ownerId });
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        const { category, quantity, unit, purchaseRate, sellingPrice, hsnCode } = req.body;

        if (category !== undefined) item.category = category;
        if (quantity !== undefined) item.quantity = quantity;
        if (unit !== undefined) item.unit = unit;
        if (purchaseRate !== undefined) item.purchaseRate = purchaseRate;
        if (sellingPrice !== undefined) item.sellingPrice = sellingPrice;
        if (hsnCode !== undefined) item.hsnCode = hsnCode;

        await item.save();

        res.status(200).json({ item, message: "Item updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update item" });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.owner.ownerId;
        
        const item = await Item.findOneAndDelete({ _id: id, userId: ownerId });
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        await Owner.findByIdAndUpdate(ownerId, { $pull: { items: id } });

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete item" });
    }
};

const getItemDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.owner.ownerId;

        const item = await Item.findOne({ _id: id, userId: ownerId });
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        const Purchase = require("../models/purchaseSchema");
        const Transaction = require("../models/transactionSchema");

        const purchaseHistory = await Purchase.find({
            userId: ownerId,
            "particulars.name": item.name
        }).sort({ date: -1 });

        const salesHistory = await Transaction.find({
            userId: ownerId,
            "particulars.name": item.name
        }).sort({ date: -1 });

        // Calculate metrics
        let totalValuePurchased = 0;
        let totalQuantityPurchased = 0;
        let timesPurchased = 0;

        purchaseHistory.forEach(purchase => {
            const purchasedItem = purchase.particulars.find(p => p.name === item.name);
            if (purchasedItem) {
                totalValuePurchased += purchasedItem.amount;
                totalQuantityPurchased += purchasedItem.qty;
                timesPurchased++;
            }
        });

        let totalValueSold = 0;
        let totalQuantitySold = 0;
        let timesSold = 0;

        salesHistory.forEach(sale => {
            const soldItem = sale.particulars.find(p => p.name === item.name);
            if (soldItem) {
                totalValueSold += soldItem.amount;
                totalQuantitySold += soldItem.qty;
                timesSold++;
            }
        });

        res.status(200).json({
            item,
            purchaseHistory,
            salesHistory,
            metrics: {
                totalValuePurchased,
                totalQuantityPurchased,
                timesPurchased,
                totalValueSold,
                totalQuantitySold,
                timesSold
            },
            message: "Item details fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch item details" });
    }
};

module.exports = {
    addItem,
    getItems,
    updateItem,
    deleteItem,
    getItemDetails
};
