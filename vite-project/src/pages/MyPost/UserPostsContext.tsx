import { createContext, useEffect, useState } from "react"
import { useParams } from "react-router"
// import { useParams } from "react-router-dom"


// 1. تصدير الـ Context مباشرة للاستخدام في المكونات
export const UserPostsContext = createContext(null)

// 2. تصدير الـ Provider الذي يجلب البيانات ويوزعها
export const UserPostsProvider = ({ children }) => {
    const { userId } = useParams()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        setLoading(true)

        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data)
                setLoading(false)
            })
    }, [userId])

    return (
        <UserPostsContext.Provider value={{ userId, posts, loading }}>
            {children}
        </UserPostsContext.Provider>
    )
}