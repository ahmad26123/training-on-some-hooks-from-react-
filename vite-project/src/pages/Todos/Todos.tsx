import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll, post, update, deleted } from "@/service/BaiseApi";
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
      return;
    }
    getAll(`todos?userId=${Number(id)}`).then((data) => {
      if (data) {
        setTodos(data);
      }
    });
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
    <div className="min-h-screen bg-stone-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المهام (Todos)</h1>
          {id && (
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              User ID: {id}
            </span>
          )}
        </div>

        {!id ? (
          <div className="text-center py-12 bg-stone-50 border-stone-200 rounded-lg shadow-sm border">
            <p className="text-lg text-gray-600">
              Please select a user first from the users list.
            </p>
          </div>
        ) : (
          <>
            {/* Create Form */}
            <div className="bg-stone-50 border-stone-200 p-6 rounded-xl shadow-md border mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">إضافة مهمة جديدة</h2>
              <form onSubmit={handleAddTodo} className="flex gap-3">
                <input
                  type="text"
                  placeholder="New todo title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50 border-stone-200"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-2 rounded-lg transition-colors shrink-0"
                >
                  Add Todo
                </button>
              </form>
            </div>

            {/* List with Update & Delete */}
            <div className="space-y-3">
              {todos.length === 0 && (
                <div className="bg-stone-50 border-stone-200 p-8 text-center text-gray-500 rounded-xl border">
                  لا توجد مهام حالياً.
                </div>
              )}

              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-stone-50 border-stone-200 p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between gap-4"
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo)}
                      className="w-5 h-5 text-emerald-800 rounded border-stone-300 focus:ring-emerald-800 cursor-pointer accent-emerald-800"
                    />
                    <span
                      className={`text-base font-medium transition-all ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </label>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3.5 py-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 font-medium rounded-md transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Todos;