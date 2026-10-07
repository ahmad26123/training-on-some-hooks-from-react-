import { useContext } from "react";
// import { UserPostsContext } from "../Users/Users";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
// import { UserPostsContext } from "./Users"; // استيراد Context من صفحة Users

const MyPost = () => {
    const { id } = useContext(UserPostsContext);
    console.log("User ID from context:", id); 
    return (
        <div>
            <Navbar />
            <h2>{id}</h2>
        </div>
    );
};

export default MyPost;