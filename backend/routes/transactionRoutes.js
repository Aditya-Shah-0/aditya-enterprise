const express = require('express');
const loggedIn = require('../middlewares/loggedIn');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/add', loggedIn, transactionController.addTransaction);
router.get('/get', loggedIn, transactionController.getTransactions);
router.patch('/update/:id', loggedIn, transactionController.updateTransaction);
router.put('/modify/:id', loggedIn, transactionController.modifyTransaction);
router.patch('/delivery/:id', loggedIn, transactionController.updateDeliveryStatus);
router.post('/bulk-payment', loggedIn, transactionController.recordBulkPayment);

module.exports = router;