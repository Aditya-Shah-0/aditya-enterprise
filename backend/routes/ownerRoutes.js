const express = require("express");
const router = express.Router();
const ownerControl = require("../controllers/ownerControl.js");
const loggedIn = require("../middlewares/loggedIn");
const upload = require("../middlewares/upload");

//partial update is going on so patch method is used

router.patch('/update-profile', loggedIn, ownerControl.updateOwner);
router.patch('/update-password', loggedIn, ownerControl.updatePassword);
router.post('/update-business-info', loggedIn, ownerControl.updateBusinessInfo);
router.get('/get-business-info', loggedIn, ownerControl.getBusinessInfo);
router.post('/update-invoice-settings', loggedIn, ownerControl.updateInvoiceSettings);
router.get('/get-invoice-settings', loggedIn, ownerControl.getInvoiceSettings);

router.post('/upload-business-assets', loggedIn, (req, res, next) => {
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'signature', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, ownerControl.uploadBusinessAssets);

module.exports = router;

