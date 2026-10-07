// import { createContext, useEffect, useState } from "react"

// export const UserPostsContext = createContext({
//     id: null,
//     toggle: () => { },
// })
// const Users = () => {
//     const [id, setId] = useState();


//     const [users, setUsers] = useState([])


//     useEffect(() => {
//         fetch("https://jsonplaceholder.typicode.com/users")
//             .then((res) => res.json())
//             .then((data) => setUsers(data))
//     }, [])

//     const toggle = () => {
//         setId((prev) => (prev === prev ? null : prev));
//     };


//     return (<>
//         <UserPostsContext.Provider value={{ id, toggle }}>

//         <div style={{ padding: "20px" }}>
//             <h1>usres list </h1>
//             <ul>
//                 {users.map((user) => (
//                     <li key={user.id} style={{ marginBottom: "10px" }}>

//                         <a href={`/mypost`} onClick={() => setId(user.id)}>{user.name}   </a>
//                     </li>
//                 ))}
//             </ul>
//             </div>
//         </UserPostsContext.Provider>

//     </>
//     )
// }

// export default Users

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
        fetch("https://jsonplaceholder.typicode.com/users")
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