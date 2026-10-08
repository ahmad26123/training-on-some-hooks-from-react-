import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll, post, deleted } from "@/service/BaiseApi";
import { Link } from "react-router";

interface Post {
  id: number | string;
  userId: number | string;
  title: string;
  body: string;

  
}
const MyPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAll("posts");
      if (data) {
        setPosts(data);
      }
    };
    getData();
  }, []);
  

  return (
    <>
      <Navbar />
      <h1>All ....</h1>

      <div>
        <ol>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

interface Comment {
  id: number | string;
  postId: number | string;
  userId: number | string;
  body: string;
  name?: string;
  email?: string;
}

const Posts = () => {
  const { id: activeUserId } = useContext(UserPostsContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // حالة نص التعليق الجديد المربوطة بمعرف البوست
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>(
    {},
  );

  //  جلب المنشورات والتعليقات 
  const loadData = async () => {
    setLoading(true);
    try {
      const [postsData, commentsData] = await Promise.all([
        getAll("posts"),
        getAll("comments"),
      ]);

      if (Array.isArray(postsData)) {
        setPosts([...postsData].reverse());
      } else {
        setPosts([]);
      }

      if (Array.isArray(commentsData)) {
        setComments(commentsData);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading posts and comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching fresh posts in Posts.tsx...");
    loadData();
  }, []);

  //  إضافة تعليق جديد مرتبط بالـ activeUserId الحالي
  const handleAddComment = async (
    e: React.FormEvent,
    postId: number | string,
  ) => {
    e.preventDefault();
    const commentBody = newComments[postId];

    if (!commentBody || !commentBody.trim() || !activeUserId) return;

    const payload = {
      postId: postId,
      userId: Number(activeUserId), // استخدام معرّف المستخدم من الـ Context
      body: commentBody.trim(),
    };

    try {
      const createdComment = await post("comments", payload);
      if (createdComment) {
        setComments((prev) => [...prev, createdComment]);
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //  حذف تعليق (يُسمح فقط للتعليقات المملوكة للمستخدم الحالي)
  const handleDeleteComment = async (commentId: number | string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

    try {
      await deleted("comments", commentId);
      setComments((prev) =>
        prev.filter((c) => String(c.id) !== String(commentId)),
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // تحديث حالة إدخال التعليق لكل بوست على حدة
  const handleCommentInputChange = (postId: number | string, value: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">جميع المنشورات</h1>
          {activeUserId ? (
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              مُسجّل بـ User ID: {activeUserId}
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              لم يتم اختيار مستخدم (التعليق غير متاح)
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">
            جاري تحميل المنشورات والتعليقات...
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((postItem) => {
              // تصفية التعليقات الخاصة بالبوست الحالي
              const postComments = comments.filter(
                (c) => String(c.postId) === String(postItem.id),
              );

              return (
                <div
                  key={postItem.id}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  {/* تفاصيل البوست */}
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {postItem.title}
                    </h2>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      User #{postItem.userId}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 whitespace-pre-line">
                    {postItem.body}
                  </p>

                  {/* قسم التعليقات */}
                  <div className="border-t pt-4 mt-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">
                      التعليقات ({postComments.length})
                    </h3>

                    {/* قائمة التعليقات */}
                    <div className="space-y-3 mb-4">
                      {postComments.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">
                          لا توجد تعليقات بعد.
                        </p>
                      ) : (
                        postComments.map((comment) => {
                          const isOwner =
                            activeUserId &&
                            String(comment.userId) === String(activeUserId);

                          return (
                            <div
                              key={comment.id}
                              className="bg-white p-3 rounded-lg border text-sm flex justify-between items-start"
                            >
                              <div>
                                <span className="font-semibold text-blue-600 text-xs block mb-1">
                                  User #{comment.userId}
                                </span>
                                <p className="text-gray-700">{comment.body}</p>
                              </div>

                              {/* زر الحذف يظهر فقط إذا كان التعليق يخص اليوزر المحدد في الـ Context */}
                              {isOwner && (
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="text-xs text-red-500 hover:text-red-700 font-medium mr-2"
                                >
                                  حذف
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* نموذج إضافة تعليق جديد */}
                    {activeUserId ? (
                      <form
                        onSubmit={(e) => handleAddComment(e, postItem.id)}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="اكتب تعليقاً..."
                          value={newComments[postItem.id] || ""}
                          onChange={(e) =>
                            handleCommentInputChange(
                              postItem.id,
                              e.target.value,
                            )
                          }
                          className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          إرسال
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-amber-600">
                        * يرجى اختيار مستخدم من صفحة Users لتمكّنك من كتابة
                        تعليق.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Posts;
