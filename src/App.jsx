import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // filter state
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (task.trim() === "") return;
    const newTask = { id: Date.now(), text: task, completed: false };
    setTodos([...todos, newTask]);
    setTask("");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearAll = () => {
    setTodos([]);
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
    setEditText("");
  };

  // Filter todos based on selection
  const filteredTodos = todos
    .slice()
    .sort((a, b) => a.completed - b.completed)
    .filter((todo) => {
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      if (search.trim() !== "" && !todo.text.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });

  return (
    <div className="app">
      <h1>✅ To-Do List</h1>

      <div className="input-area">
        <input
          type="text"
          value={task}
          placeholder="Enter a task"
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      

      {/* Filter Bar */}
      <div className="filter-bar">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ul className="task-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>💾 Save</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleComplete(todo.id)}>
                  {todo.text}
                </span>
                <div>
                  <button onClick={() => startEdit(todo.id, todo.text)}>✏️</button>
                  <button onClick={() => deleteTask(todo.id)}>❌</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="search-area">
        <input
          type="text"
          value={search}
          placeholder="🔍 Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="task-info">
        <p>{todos.filter((todo) => !todo.completed).length} tasks left</p>
        {todos.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
