import { useEffect, useState } from "react"

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
    }, [])

    return (
        <div style={{ padding: "20px" }}>
            <h1>usres list </h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id} style={{ marginBottom: "10px" }}>
                        <a href={`/mypost/${user.id}`}>{user.name}   </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Users