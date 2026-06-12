const Todo = require("../models/todoSchema");
const Owner = require("../models/owners");

const addTodo = async (req, res) => {
    try {
        const { task } = req.body;
        if (!task || !task.trim()) {
            return res.status(400).json({ error: "Task description is required" });
        }
        const ownerId = req.owner.ownerId;
        const todo = await Todo.create({
            owner: ownerId,
            task: task.trim(),
            completed: false
        });
        res.status(201).json({ todo, message: "Successfully added task" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add task" });
    }
};

const getTodos = async (req, res) => {
    try {
        const ownerId = req.owner.ownerId;
        const todos = await Todo.find({ owner: ownerId }).sort({ createdAt: -1 });
        res.status(200).json({ todos, message: "Successfully fetched tasks" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;
        
        const todo = await Todo.findOne({ _id: id, owner: req.owner.ownerId });
        if (!todo) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task !== undefined) todo.task = task.trim();
        if (completed !== undefined) todo.completed = completed;

        await todo.save();
        res.status(200).json({ todo, message: "Successfully updated task" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update task" });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findOneAndDelete({ _id: id, owner: req.owner.ownerId });
        if (!todo) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Successfully deleted task" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};

module.exports = {
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo
};
