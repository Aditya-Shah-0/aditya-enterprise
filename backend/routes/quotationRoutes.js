const express = require('express');
const loggedIn = require('../middlewares/loggedIn');
const quotationController = require('../controllers/quotationController');
const router = express.Router();

router.post('/add', loggedIn, quotationController.addQuotation);
router.get('/get', loggedIn, quotationController.getQuotations);
router.patch('/status/:id', loggedIn, quotationController.updateQuotationStatus);
router.delete('/delete/:id', loggedIn, quotationController.deleteQuotation);

module.exports = router;
