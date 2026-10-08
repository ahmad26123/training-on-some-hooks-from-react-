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

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    getAll(`albums?userId=${id}`).then((data: Album[]) => {
      if (data) {
        setAlbums(data);
      }
    });
  }, [id, navigate]);

  useEffect(() => {
    if (!selectedAlbum) return;

    getAll(`photos?albumId=${selectedAlbum.id}`).then((data: Photo[]) => {
      if (data) setPhotos(data);
    });
  }, [selectedAlbum]);

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

  const handleDeleteAlbum = async (albumId: number | string) => {
    const res = await deleted("albums", albumId);
    if (res !== undefined) {
      setAlbums(albums.filter((a) => a.id !== albumId));
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
    }
  };

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

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoFile || !selectedAlbum) {
      alert("الرجاء إدخال عنوان الصورة واختيار ملف");
      return;
    }

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

  const handleDeletePhoto = async (photoId: number | string) => {
    const res = await deleted("photos", photoId);
    if (res !== undefined) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الألبومات</h1>
          {id && (
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              User ID: {id}
            </span>
          )}
        </div>

        {!id ? (
          <div className="text-center py-12 bg-stone-50 rounded-lg shadow-sm border">
            <p className="text-lg text-gray-600">
              الرجاء اختيار مستخدم أولاً من قائمة المستخدمين.
            </p>
          </div>
        ) : !selectedAlbum ? (
          <>
            {/* نموذج إضافة ألبوم جديد */}
            <div className="bg-stone-50 p-6 rounded-xl shadow-md border mb-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4">إضافة ألبوم جديد</h2>
              <form onSubmit={handleAddAlbum} className="flex gap-3">
                <input
                  type="text"
                  placeholder="New album title..."
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-2 rounded-lg transition-colors shrink-0"
                >
                  Add Album
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {albums.length === 0 && (
                <div className="bg-stone-50 p-8 text-center text-gray-500 rounded-xl border">
                  لا يوجد ألبومات بعد.
                </div>
              )}

              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-stone-50 p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex items-center justify-between gap-4"
                >
                  <div
                    onClick={() => setSelectedAlbum(album)}
                    className="flex items-center gap-3 cursor-pointer flex-1 group"
                  >
                    <span className="text-2xl">📁</span>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {album.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAlbum(album)}
                      className="px-3.5 py-1.5 text-xs bg-emerald-50 text-emerald-800 font-medium rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      عرض الصور
                    </button>
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="px-3.5 py-1.5 text-xs bg-amber-100 text-amber-700 font-medium rounded-md hover:bg-amber-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="px-3.5 py-1.5 text-xs bg-red-100 text-red-700 font-medium rounded-md hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /*  عرض صور الألبوم  */
          <>
            <button
              onClick={() => setSelectedAlbum(null)}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-stone-50 border rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              ← العودة لقائمة الألبومات
            </button>

            <div className="bg-stone-50 p-6 rounded-xl shadow-md border mb-8">
              <div className="border-b pb-4 mb-5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  صور الألبوم: {selectedAlbum.title}
                </h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-semibold">
                  Album ID: {selectedAlbum.id}
                </span>
              </div>

              {/* فورم إضافة صورة داخل الألبوم الحالي */}
              <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="اسم الصورة..."
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-stone-50 text-sm"
                  required
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoFile(e.target.files[0]);
                    }
                  }}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                />

                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors shrink-0"
                >
                  إضافة صورة
                </button>
              </form>
            </div>

            {/* شبكة عرض الصور */}
            {photos.length === 0 ? (
              <div className="bg-stone-50 p-8 text-center text-gray-400 italic rounded-xl border">
                لا يوجد صور في هذا الألبوم بعد.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-stone-50 rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                  >
                    <div className="w-full h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/300x200?text=Image+Not+Found";
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <p className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2">
                        {photo.title}
                      </p>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="w-full py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-md transition-colors"
                      >
                        حذف الصورة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Albums;