import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar/Navbar"
import { getAll } from "../../service/BaiseApi";
// import { }
// import { getAll } from "../../service/BaiseApi.ts";

const MyPost = () => {

  const [posts, setPosts] = useState([]);



  useEffect(() => {
    const getData = async () => {
      const data = await getAll("posts");
      if (data) {
        setPosts(data);
      }
    }
    getData();
  }, []
  )
  // useEffect(() => {
  //   const getPosts = async () => {
  //     const resp = await fetch("https://jsonplaceholder.typicode.com/posts");
  //     const res = await resp.json();
  //     setPosts(res);
  //   };
  //   getPosts();
  // }, []);

  return (
    <>
      <Navbar />
      <h1>All ....</h1>

      <div>
        <ol>
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </li>
          ))}
        </ol>
      </div>

    </>
  )
}

export default MyPost
