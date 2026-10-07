// import { createContext, useContext, useEffect, useState } from "react"
// import { useParams } from "react-router"
// import { UserPostsContext } from "../Users/Users";
// // import { useParams } from "react-router"
// // import { useParams } from "react-router-dom"


// // export const UserPostsContext = createContext(null)

// export const UserPostsProvider = ({ children }) => {
//     const { userId } = useContext(UserPostsContext);

//     const [posts, setPosts] = useState([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!userId) return
//         setLoading(true)

//         fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setPosts(data)
//                 setLoading(false)
//             })
//     }, [userId])

//     return (
//         <UserPostsContext.Provider value={{ userId, posts, loading }}>
//             {children}
//         </UserPostsContext.Provider>
//     )
// }