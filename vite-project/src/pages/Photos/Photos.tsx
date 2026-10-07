import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll, post, deleted } from "@/service/BaiseApi";

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const Photos = () => {
  const { id } = useContext(UserPostsContext);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState("");
  const [imageType, setImageType] = useState<"picsum" | "local">("picsum");
  const [localImageName, setLocalImageName] = useState("");

  // 1. جلب الصور (يمكنك جلب صور الألبوم المحدد أو جلب الكل)
  useEffect(() => {
    if (!id) return;

    // جلب صور الـ albumId الخاص باليوزر
    getAll(`photos?albumId=${id}`).then((data: Photo[]) => {
      if (data) setPhotos(data);
    });
  }, [id]);

  // 2. إضافة صورة جديدة
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !id) return;

    let photoUrl = "";
    let thumbUrl = "";

    if (imageType === "picsum") {
      // توليد رابط Picsum عشوائي مثل بيانات الـ JSON الأصلية
      const randomSeed = Math.floor(Math.random() * 1000) + 1;
      photoUrl = `https://picsum.photos/seed/${randomSeed}/600`;
      thumbUrl = `https://picsum.photos/seed/${randomSeed}/150`;
    } else {
      // استخدام الرابط المحلي من مجلد images
      const imageName = localImageName.trim() || "02.jpg";
      photoUrl = `http://localhost:5173/images/${imageName}`;
      thumbUrl = `http://localhost:5173/images/${imageName}`;
    }

    // بناء الكائن تماماً بنفس هيكل الـ JSON
    const newPhotoData = {
      albumId: id,
      title: title,
      url: photoUrl,
      thumbnailUrl: thumbUrl,
    };

    const res = await post("photos", newPhotoData);
    if (res) {
      setPhotos([...photos, res]);
      setTitle("");
      setLocalImageName("");
    }
  };

  // 3. حذف صورة
  const handleDeletePhoto = async (photoId: number) => {
    const res = await deleted("photos", photoId);
    if (res !== undefined) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Photos Gallery (Album / User ID: {id})</h2>

        {!id && <p>الرجاء اختيار مستخدم أولاً من قائمة المستخدمين.</p>}

        {id && (
          <>
            {/* فورم إضافة صورة */}
            <form
              onSubmit={handleAddPhoto}
              style={{
                marginBottom: "25px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="عنوان الصورة..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: "8px" }}
              />

              <select
                value={imageType}
                onChange={(e) => setImageType(e.target.value as "picsum" | "local")}
                style={{ padding: "8px" }}
              >
                <option value="picsum">توليد من Picsum (مثل الجيسون الأصلي)</option>
                <option value="local">صورة من مجلد images المحلي</option>
              </select>

              {imageType === "local" && (
                <input
                  type="text"
                  placeholder="اسم ملف الصورة (مثلاً: 02.jpg)"
                  value={localImageName}
                  onChange={(e) => setLocalImageName(e.target.value)}
                  style={{ padding: "8px" }}
                />
              )}

              <button type="submit">Add Photo</button>
            </form>

            {/* شبكة عرض الصور */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/150x150?text=No+Image";
                    }}
                  />
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "10px 0",
                      height: "36px",
                      overflow: "hidden",
                    }}
                  >
                    {photo.title}
                  </p>
                  <button onClick={() => handleDeletePhoto(photo.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Photos;