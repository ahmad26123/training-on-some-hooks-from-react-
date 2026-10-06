import { useContext } from "react"
import Navbar from "../../components/Navbar/Navbar"
import { UserPostsContext, UserPostsProvider } from "./UserPostsContext"

const PostsList = () => {
    const { userId, posts, loading } = useContext(UserPostsContext)

    if (loading) {
        return <h2> loding ....    {userId}...</h2>
    }

    return (
        <div>
            <h2> user post  : {userId}</h2>
            <ol>
                {posts.map((post) => (
                    <li key={post.id} style={{ marginBottom: "15px" }}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ol>
        </div>
    )
}

const MyPost = () => {
    return (
        <UserPostsProvider>
            <Navbar />
            <h1>صفحة المنشورات</h1>
            <PostsList />
        </UserPostsProvider>
    )
}

export default MyPost