import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll, post, update, deleted } from "@/service/BaiseApi";
import { useNavigate } from "react-router";

type Album = {
  userId: number;
  id: number | string;
  title: string;
};

type Photo = {
  albumId: number | string;
  id: number | string;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const Albums = () => {
  const { id } = useContext(UserPostsContext);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  // الألبوم المفتوح حالياً
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // 1. جلب ألبومات المستخدم عند وجود id بالكونتكست
  const navigate = useNavigate();

  // 1. فحص الريفريش + جلب ألبومات المستخدم
  useEffect(() => {
    // إذا ما في id يرجع للهوم
    if (!id) {
      navigate("/");
      return;
    }

    // جلب ألبومات هذا المستخدم وعرضها
    getAll(`albums?userId=${id}`).then((data: Album[]) => {
      if (data) {
        setAlbums(data);
      }
    });
  }, [id, navigate]);

  // 2. جلب صور الألبوم المختار
  useEffect(() => {
    if (!selectedAlbum) return;

    getAll(`photos?albumId=${selectedAlbum.id}`).then((data: Photo[]) => {
      if (data) setPhotos(data);
    });
  }, [selectedAlbum]);

  // إضافة ألبوم جديد
  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim() || !id) return;

    const res = await post("albums", {
      userId: Number(id),
      title: newAlbumTitle,
    });
    if (res) {
      setAlbums([...albums, res]);
      setNewAlbumTitle("");
    }
  };

  // حذف ألبوم
  const handleDeleteAlbum = async (albumId: number | string) => {
    const res = await deleted("albums", albumId);
    if (res !== undefined) {
      setAlbums(albums.filter((a) => a.id !== albumId));
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
    }
  };

  // تعديل اسم الألبوم
  const handleEditAlbum = async (album: Album) => {
    const updatedTitle = prompt("أدخل اسم الألبوم الجديد:", album.title);
    if (!updatedTitle || updatedTitle.trim() === album.title) return;

    const res = await update("albums", album.id, {
      ...album,
      title: updatedTitle,
    });
    if (res) {
      setAlbums(albums.map((a) => (a.id === album.id ? res : a)));
      if (selectedAlbum?.id === album.id) {
        setSelectedAlbum(res);
      }
    }
  };

  // إضافة صورة جديدة داخل الألبوم
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoFile || !selectedAlbum) {
      alert("الرجاء إدخال عنوان الصورة واختيار ملف");
      return;
    }

    // بناء الرابط المحلي لملف الصورة
    const localUrl = `http://localhost:5173/images/${photoFile.name}`;

    const newPhotoData = {
      albumId: selectedAlbum.id,
      title: photoTitle,
      url: localUrl,
      thumbnailUrl: localUrl,
    };

    const res = await post("photos", newPhotoData);
    if (res) {
      setPhotos([...photos, res]);
      setPhotoTitle("");
      setPhotoFile(null);
    }
  };

  // حذف صورة
  const handleDeletePhoto = async (photoId: number | string) => {
    const res = await deleted("photos", photoId);
    if (res !== undefined) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        {!id && <p>الرجاء اختيار مستخدم أولاً من قائمة المستخدمين.</p>}

        {id && !selectedAlbum && (
          <>
            <h2>User Albums (User ID: {id})</h2>

            <form onSubmit={handleAddAlbum} style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="New album title..."
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                style={{ padding: "8px", marginRight: "10px" }}
              />
              <button type="submit">Add Album</button>
            </form>

            <ul style={{ padding: 0, listStyle: "none" }}>
              {albums.map((album) => (
                <li
                  key={album.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span
                    style={{ flex: 1, cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => setSelectedAlbum(album)}
                  >
                    📁 {album.title}
                  </span>
                  <button onClick={() => setSelectedAlbum(album)}>عرض الصور</button>
                  <button onClick={() => handleEditAlbum(album)}>Edit</button>
                  <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}

        {id && selectedAlbum && (
          <>
            <button
              onClick={() => setSelectedAlbum(null)}
              style={{ marginBottom: "15px" }}
            >
              ⬅ العودة لقائمة الألبومات
            </button>

            <h2>
              صور الألبوم: {selectedAlbum.title} (Album ID: {selectedAlbum.id})
            </h2>

            {/* فورم إضافة صورة داخل الألبوم الحالي */}
            <form
              onSubmit={handleAddPhoto}
              style={{
                marginBottom: "20px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="اسم الصورة..."
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                style={{ padding: "8px" }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhotoFile(e.target.files[0]);
                  }
                }}
              />

              <button type="submit">إضافة صورة</button>
            </form>

            {/* عرض الصور */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {photos.length === 0 && <p>لا يوجد صور في هذا الألبوم بعد.</p>}

              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    width: "180px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    style={{
                      width: "100%",
                      height: "140px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/150x150?text=Image+Not+Found";
                    }}
                  />
                  <p style={{ fontSize: "14px", margin: "8px 0" }}>{photo.title}</p>
                  <button onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Albums;