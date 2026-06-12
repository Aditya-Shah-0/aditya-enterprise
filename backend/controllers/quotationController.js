const quotationSchema = require("../models/quotationSchema");
const ownerSchema = require("../models/owners");

const addQuotation = async (req, res) => {
    try {
        const { ...quotationData } = req.body;
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        const quotation = new quotationSchema({
            userId: owner._id,
            ...quotationData
        });
        await quotation.save();
        owner.quotations.push(quotation._id);
        await owner.save();
        res.status(201).json({ quotation, message: "Successfully added quotation" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add quotation" });
    }
};

const getQuotations = async (req, res) => {
    try {
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        const quotations = await quotationSchema.find({ userId: owner._id }).sort({ createdAt: -1 });
        res.status(200).json({ quotations, message: "Successfully fetched quotations" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get quotations" });
    }
};

const updateQuotationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Draft", "Sent", "Accepted", "Declined", "Invoiced"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const quotation = await quotationSchema.findById(id);
        if (!quotation) {
            return res.status(404).json({ error: "Quotation not found" });
        }

        quotation.status = status;
        await quotation.save();

        res.status(200).json({ quotation, success: true, message: "Successfully updated quotation status" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update quotation" });
    }
};

const deleteQuotation = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await ownerSchema.findById(req.owner.ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        const quotation = await quotationSchema.findByIdAndDelete(id);
        if (!quotation) {
            return res.status(404).json({ error: "Quotation not found" });
        }

        owner.quotations = owner.quotations.filter(qId => qId.toString() !== id);
        await owner.save();

        res.status(200).json({ success: true, message: "Successfully deleted quotation" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete quotation" });
    }
};

module.exports = {
    addQuotation,
    getQuotations,
    updateQuotationStatus,
    deleteQuotation
};
