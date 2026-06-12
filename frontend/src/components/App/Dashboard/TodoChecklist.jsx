import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Check, X, Circle, CheckCircle2, Loader2 } from "lucide-react";
import todoService from "../../../services/todoService";
import toast from "react-hot-toast";

const TodoChecklist = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [todosLoading, setTodosLoading] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setTodosLoading(true);
      try {
        const data = await todoService.getTodos();
        setTodos(data.todos || []);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      } finally {
        setTodosLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const data = await todoService.addTodo(newTodo);
      setTodos([data.todo, ...todos]);
      setNewTodo("");
      toast.success("Task added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const data = await todoService.updateTodo(id, { completed: !currentStatus });
      setTodos(todos.map((t) => (t._id === id ? data.todo : t)));
      toast.success(!currentStatus ? "Task marked as completed" : "Task marked as pending");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleStartEdit = (id, text) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const data = await todoService.updateTodo(id, { task: editingText });
      setTodos(todos.map((t) => (t._id === id ? data.todo : t)));
      setEditingTodoId(null);
      toast.success("Task updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-black dark:text-white">Today's Checklist</h3>
          {todos.length > 0 && (
            <span className="bg-violet-50 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-violet-100">
              {todos.filter((t) => t.completed).length} / {todos.length}
            </span>
          )}
        </div>
      </div>

      {/* Add Task Input Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-4 shrink-0">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          title="Add Task"
        >
          <Plus className="size-4" />
        </button>
      </form>

      {/* Scrollable checklist items list */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 no-scrollbar">
        {todosLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin size-6 text-violet-600" />
          </div>
        ) : todos.length > 0 ? (
          todos.map((todo) => {
            const isEditing = editingTodoId === todo._id;
            return (
              <div
                key={todo._id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-gray-750 bg-gray-50/50 dark:bg-gray-800/50 group"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Checkbox Complete Action Button */}
                  <button
                    onClick={() => handleToggleComplete(todo._id, todo.completed)}
                    className="text-gray-400 hover:text-violet-600 transition-colors shrink-0 cursor-pointer"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="size-5" />
                    )}
                  </button>

                  {/* Task Text or Edit Input */}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-2 py-0.5 border border-violet-300 rounded text-sm bg-white dark:bg-gray-900 focus:outline-none text-gray-800 dark:text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(todo._id);
                        else if (e.key === "Escape") setEditingTodoId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`text-sm truncate font-medium flex-1 ${
                        todo.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {todo.task}
                    </span>
                  )}
                </div>

                {/* Actions Panel */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(todo._id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                        title="Save"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={() => setEditingTodoId(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {!todo.completed && (
                        <button
                          onClick={() => handleStartEdit(todo._id, todo.task)}
                          className="p-1 text-gray-400 hover:text-violet-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="size-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
            <CheckCircle2 className="size-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              All caught up!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              Add a task above to manage business todo goals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoChecklist;
