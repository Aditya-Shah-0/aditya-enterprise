const express = require('express');
const loggedIn = require('../middlewares/loggedIn');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.post('/add', loggedIn, purchaseController.addPurchase);
router.get('/get', loggedIn, purchaseController.getPurchases);
router.patch('/update/:id', loggedIn, purchaseController.updatePurchase);
router.put('/modify/:id', loggedIn, purchaseController.modifyPurchase);
router.patch('/delivery/:id', loggedIn, purchaseController.updateDeliveryStatus);

module.exports = router;
