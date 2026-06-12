const express = require('express');
const loggedIn = require('../middlewares/loggedIn');
const todoController = require('../controllers/todoController');
const router = express.Router();

router.post('/add', loggedIn, todoController.addTodo);
router.get('/get', loggedIn, todoController.getTodos);
router.patch('/update/:id', loggedIn, todoController.updateTodo);
router.delete('/delete/:id', loggedIn, todoController.deleteTodo);

module.exports = router;
