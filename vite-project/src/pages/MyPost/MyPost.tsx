import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll, post, update, deleted } from "@/service/BaiseApi";

interface Post {
  id: number | string;
  userId: number | string;
  title: string;
  body: string;
}

interface Comment {
  id: number | string;
  postId: number | string;
  userId?: number | string;
  body: string;
}

const MyPost = () => {
  const { id } = useContext(UserPostsContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // حالات الإضافة والتعديل للبوست
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // إدارة التعليقات المفتوحة وإدخالات التعليقات
  const [openCommentsPostId, setOpenCommentsPostId] = useState<
    number | string | null
  >(null);
  const [commentsMap, setCommentsMap] = useState<{
    [postId: string]: Comment[];
  }>({});
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

  // 1. القراءة (READ POSTS)
  const loadPosts = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data: Post[] = await getAll(`posts?userId=${id}`);
      if (Array.isArray(data)) {
        setPosts([...data].reverse());
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("READ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [id]);

  // جلب تعليقات منشور محدد
  const loadCommentsForPost = async (postId: number | string) => {
    setCommentsLoading(true);
    try {
      const data: Comment[] = await getAll(`comments?postId=${postId}`);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: data || [],
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // تبديل إظهار/إخفاء قسم التعليقات
  const toggleComments = (postId: number | string) => {
    if (openCommentsPostId === postId) {
      setOpenCommentsPostId(null);
    } else {
      setOpenCommentsPostId(postId);
      loadCommentsForPost(postId);
    }
  };

  // 2. الإنشاء (CREATE POST)
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !id) return;

    const numericUserId = Number(id);

    const payload = {
      userId: isNaN(numericUserId) ? id : numericUserId,
      title: newTitle,
      body: newBody,
    };

    try {
      const response = await post("posts", payload);
      if (response) {
        setNewTitle("");
        setNewBody("");
        await loadPosts();
      }
    } catch (error) {
      console.error("CREATE Error:", error);
    }
  };

  // 3. التحديث (UPDATE POST)
  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const updatedData = await update("posts", editingPost.id, editingPost);
      if (updatedData) {
        await loadPosts();
        setEditingPost(null);
      }
    } catch (error) {
      console.error("UPDATE Error:", error);
    }
  };

  // 4. الحذف المترابط (DELETE POST + CASCADE COMMENTS)
  const handleDeletePost = async (postId: number | string) => {
    if (!confirm("هل أنت متأكد من حذف هذا البوست وكل التعليقات المرتبطة به؟"))
      return;

    try {
      console.log("جارٍ حذف البوست برقم ID:", postId);

      // 1. حذف البوست الأساسي من السيرفر أولاً
      const deleteRes = await deleted("posts", postId);
      console.log("نتيجة حذف البوست من السيرفر:", deleteRes);

      // 2. محاولة حذف التعليقات التابعة له (إن وجدت) بدون إيقاف كود حذف البوست
      try {
        const comments: Comment[] = await getAll(`comments?postId=${postId}`);
        if (Array.isArray(comments) && comments.length > 0) {
          await Promise.all(comments.map((c) => deleted("comments", c.id)));
        }
      } catch (commentErr) {
        console.warn("تنبيه عند حذف التعليقات:", commentErr);
      }

      // 3. تحديث واجهة MyPost فوراً وحذف العنصر من الشاشة محلياً
      setPosts((prevPosts) =>
        prevPosts.filter((p) => String(p.id) !== String(postId)),
      );
    } catch (error) {
      console.error("فشل حذف البوست:", error);
    }
  };

  // 5. إضافة تعليق جديد (CREATE COMMENT)
  const handleAddComment = async (
    e: React.FormEvent,
    postId: number | string,
  ) => {
    e.preventDefault();
    const body = commentInputs[postId];
    if (!body || !body.trim() || !id) return;

    const commentPayload = {
      postId: postId,
      userId: Number(id),
      body: body.trim(),
    };

    try {
      const createdComment: Comment = await post("comments", commentPayload);
      if (createdComment) {
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), createdComment],
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("CREATE COMMENT Error:", error);
    }
  };

  // 6. حذف أي تعليق على المنشور (DELETE ANY COMMENT)
  const handleDeleteComment = async (
    commentId: number | string,
    postId: number | string,
  ) => {
    if (!confirm("هل أنت تأكد من حذف هذا التعليق؟")) return;

    try {
      await deleted("comments", commentId);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(
          (c) => String(c.id) !== String(commentId),
        ),
      }));
    } catch (error) {
      console.error("DELETE COMMENT Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المنشورات</h1>
          {id && (
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              User ID: {id}
            </span>
          )}
        </div>

        {!id ? (
          <div className="text-center py-12 bg-stone-50 border-stone-200 rounded-lg shadow-sm border">
            <p className="text-lg text-gray-600">
              يرجى اختيار مستخدم من صفحة المستخدمين أولاً لعرض منشوراته.
            </p>
          </div>
        ) : (
          <>
            {/* نموذج إضافة منشور جديد */}
            <div className="bg-stone-50 border-stone-200 p-6 rounded-xl shadow-md border mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                إضافة منشور جديد
              </h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="عنوان المنشور"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="محتوى المنشور..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  نشر الآن
                </button>
              </form>
            </div>

            {loading && (
              <p className="text-center text-gray-500 py-8">
                جاري تحميل البيانات...
              </p>
            )}

            {/* عرض قائمة المنشورات */}
            <div className="space-y-4">
              {posts.map((post) => {
                const isCommentsOpen = openCommentsPostId === post.id;
                const postComments = commentsMap[post.id] || [];

                return (
                  <div
                    key={post.id}
                    className="bg-stone-50 border-stone-200 rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 whitespace-pre-line">
                        {post.body}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setEditingPost(post)}
                            className="px-4 py-1.5 text-sm bg-amber-100 text-amber-700 font-medium rounded-md hover:bg-amber-200 transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-4 py-1.5 text-sm bg-red-100 text-red-700 font-medium rounded-md hover:bg-red-200 transition-colors"
                          >
                            حذف
                          </button>
                        </div>

                        {/* زر عرض الكومنتات */}
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition-colors"
                        >
                          {isCommentsOpen ? "إخفاء التعليقات" : "عرض التعليقات"}
                        </button>
                      </div>
                    </div>

                    {/* قسم التعليقات المنسدل */}
                    {isCommentsOpen && (
                      <div className="bg-gray-50 p-6 border-t">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">
                          التعليقات ({postComments.length})
                        </h4>

                        {commentsLoading ? (
                          <p className="text-xs text-gray-500 py-2">
                            جاري تحميل التعليقات...
                          </p>
                        ) : (
                          <div className="space-y-2 mb-4">
                            {postComments.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">
                                لا توجد تعليقات بعد.
                              </p>
                            ) : (
                              postComments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="bg-stone-50 border-stone-200 p-3 rounded-lg border text-sm flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    {comment.userId && (
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                                        User #{comment.userId}
                                      </span>
                                    )}
                                    <p className="text-gray-700">
                                      {comment.body}
                                    </p>
                                  </div>

                                  {/* زر الحذف متاح دائماً لكل التعليقات على منشوراتك */}
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id, post.id)
                                    }
                                    className="px-2.5 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded transition-colors ml-2 shrink-0"
                                  >
                                    حذف الكومنت
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* نموذج إضافة تعليق جديد */}
                        <form
                          onSubmit={(e) => handleAddComment(e, post.id)}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            placeholder="اكتب تعليقاً جديداً..."
                            value={commentInputs[post.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 bg-stone-50 border-stone-200"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            تعليق
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* نافذة التعديل المنبثقة */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-stone-50 border-stone-200 rounded-xl max-w-lg w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                تعديل المنشور
              </h3>
              <form onSubmit={handleUpdatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المحتوى
                  </label>
                  <textarea
                    rows={4}
                    value={editingPost.body}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, body: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPost;
