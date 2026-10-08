import { UserPostsContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

type User = {
  id: number;
  name: string;
};

const Users = () => {
  const { setId } = useContext(UserPostsContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  const handleUserClick = (userId: number | null) => {
    console.log("User ID clicked:", userId);
    setId(userId);
    navigate("/mypost");
  };

  return (
    <div className="min-h-screen bg-stone-100 py-10 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">قائمة المستخدمين</h1>
          <p className="text-sm text-gray-500 mt-1">اختر مستخدماً للمتابعة إلى صفحته الشخصية</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="bg-stone-50 border-stone-200p-5 rounded-xl border shadow-sm hover:shadow-md hover:border-emerald-7000 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white">
                  {user.id}
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-emerald-800 transition-colors">
                  {user.name}
                </span>
              </div>
              <span className="text-gray-400 group-hover:text-blue-500 text-sm transition-colors">
                ←
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Users;