import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { post, update, deleted } from "@/service/BaiseApi";
import { useNavigate } from "react-router";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const Todos = () => {
  const { id } = useContext(UserPostsContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  // 1. Read
 useEffect(() => {
  if (!id) {
    navigate("/");
  }
}, [id, navigate]);

  // 2. Create
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !id) return;

    const newTodoData = {
      userId: id,
      title: newTitle,
      completed: false,
    };

    const res = await post("todos", newTodoData);
    if (res) {
      setTodos([...todos, res]);
      setNewTitle("");
    }
  };

  // 3. Update (Toggle completed)
  const handleToggleComplete = async (todo: Todo) => {
    const updatedData = { ...todo, completed: !todo.completed };
    const res = await update("todos", todo.id, updatedData);
    if (res) {
      setTodos(todos.map((item) => (item.id === todo.id ? res : item)));
    }
  };

  // 4. Delete
  const handleDelete = async (todoId: number) => {
    const res = await deleted("todos", todoId);
    if (res !== undefined) {
      setTodos(todos.filter((item) => item.id !== todoId));
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>User Todos (User ID: {id})</h2>

        {!id && <p>Please select a user first from the users list.</p>}

        {id && (
          <>
            {/* Create Form */}
            <form onSubmit={handleAddTodo} style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="New todo title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ padding: "8px", marginRight: "10px" }}
              />
              <button type="submit">Add Todo</button>
            </form>

            {/* List with Update & Delete */}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      flex: 1,
                    }}
                  >
                    {todo.title}
                  </span>
                  <button onClick={() => handleDelete(todo.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Todos;