const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const loggedIn = require('../middlewares/loggedIn');

router.post('/add', loggedIn, itemController.addItem);
router.get('/get-all', loggedIn, itemController.getItems);
router.get('/details/:id', loggedIn, itemController.getItemDetails);
router.patch('/update/:id', loggedIn, itemController.updateItem);
router.delete('/delete/:id', loggedIn, itemController.deleteItem);

module.exports = router;
