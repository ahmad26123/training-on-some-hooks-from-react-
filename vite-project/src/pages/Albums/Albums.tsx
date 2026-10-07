import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { UserPostsContext } from "@/App";
import { getAll } from "@/service/BaiseApi"; // أو مسار الملف الصحيح عندك

type Album = {
    userId: number;
    id: number;
    title: string;
};

const Albums = () => {
    const { id } = useContext(UserPostsContext);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        // نطلب ألبومات هذا اليوزر بالتحديد
        getAll(`albums?userId=${id}`)
            .then((data: Album[]) => {
                if (data) {
                    setAlbums(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <h2>User Albums (User ID: {id})</h2>

                {!id && <p>Please select a user first from the users list.</p>}

                {loading && <p>Loading albums...</p>}

                <ul>
                    {albums.map((album) => (
                        <li key={album.id} style={{ marginBottom: "8px" }}>
                            {album.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Albums;