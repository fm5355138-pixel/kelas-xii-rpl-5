import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot, orderBy, query } from "firebase/firestore";

const BoxGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dengarkan perubahan data secara real-time dari Firestore GambarAman.
    // Sebelumnya pakai getDocs() sekali saat mount, jadi foto baru yang
    // diupload tidak akan pernah muncul tanpa reload halaman.
    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, "GambarAman"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const imageList = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.imageUrl) {
                        imageList.push({
                            id: doc.id,
                            url: data.imageUrl,
                            timestamp: data.createdAt ? data.createdAt.toDate() : new Date(),
                        });
                    }
                });
                setImages(imageList);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching gallery:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div id="BoxGallery" className="p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-md">
            <div className="flex justify-between items-center mb-3">
                <img src="/upload.png" alt="Upload Icon" className="w-auto h-10" />
                <img src="/next.png" alt="Next Icon" className="h-5 w-5 cursor-pointer" />
            </div>

            <h1 className="text-white text-xl pr-3 font-semibold mb-4">Class Gallery</h1>

            {/* Bagian Grid untuk Menampilkan Foto Hasil Upload */}
            {loading ? (
                <div className="text-gray-500 text-sm">Loading memories...</div>
            ) : images.length === 0 ? (
                <div className="text-gray-600 text-xs">Belum ada foto yang di-upload.</div>
            ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[15rem] overflow-y-auto overflow-y-scroll-no-thumb">
                    {images.map((image) => (
                        <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-black">
                            <img
                                src={image.url}
                                alt="Class Memory"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/150x150?text=Error";
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BoxGallery;