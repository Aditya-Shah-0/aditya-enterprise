const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loggedIn = require('../middlewares/loggedIn');

router.post('/register', authController.registerOwner);
router.post('/login', authController.loginOwner);
router.get('/check', loggedIn, authController.checkUser);
router.post('/logout', loggedIn, authController.logout);

module.exports = router;