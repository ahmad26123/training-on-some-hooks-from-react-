
import { UserPostsContext } from "@/App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { useNavigate } from "react-router-dom";

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
        <div style={{ padding: "20px" }}>
            <h1>users list</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id} style={{ marginBottom: "10px" }}>
                        <button
                            onClick={() => {
                                handleUserClick(user.id);
                            }}
                        >
                            {user.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;