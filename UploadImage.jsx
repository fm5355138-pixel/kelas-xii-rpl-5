import React, { useState, useEffect } from "react";
// Mengganti import Storage menjadi Firestore
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";

function UploadImage() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]); // Tetap dipertahankan sesuai kode aslimu
  const maxUploadSizeInBytes = 10 * 1024 * 1024; // 10MB
  const maxUploadsPerDay = 20;
  
  useEffect(() => {
    // listImages(); 
  }, []);

  const uploadImage = () => {
    if (imageUpload == null) return;

    const uploadedImagesCount = parseInt(localStorage.getItem("uploadedImagesCount")) || 0;
    const lastUploadDate = localStorage.getItem("lastUploadDate");

    if (uploadedImagesCount >= maxUploadsPerDay) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have reached the maximum uploads for today.",
        customClass: {
          container: "sweet-alert-container",
        },
      });
      return;
    }

    if (lastUploadDate && new Date(lastUploadDate).toDateString() !== new Date().toDateString()) {
      localStorage.setItem("uploadedImagesCount", 0);
    }

    if (imageUpload.size > maxUploadSizeInBytes) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The maximum size for a photo is 10MB",
        customClass: {
          container: "sweet-alert-container",
        },
      });
      return;
    }

    // Tampilkan loading ramah dari SweetAlert agar user tahu proses sedang berjalan
    Swal.fire({
      title: "Uploading...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append("image", imageUpload);

    // Ambil API key dari environment variable, JANGAN hardcode langsung di kode.
    // Buat file .env di root project berisi: VITE_IMGBB_API_KEY=your_own_private_key
    // (ganti VITE_ prefix sesuai bundler yang dipakai, mis. REACT_APP_ untuk CRA)
    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!imgbbApiKey) {
      Swal.fire({
        icon: "error",
        title: "Konfigurasi belum lengkap",
        text: "API key ImgBB belum di-set. Cek file .env kamu.",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal merespon API ImgBB");
        return res.json();
      })
      .then((result) => {
        if (!result.success) throw new Error("Gagal hosting gambar");

        const url = result.data.url; // Link langsung (.jpg/.png) hasil convert file

        // Simpan URL tersebut ke Cloud Firestore Database ('GambarAman')
        const db = getFirestore();
        return addDoc(collection(db, "GambarAman"), {
          imageUrl: url,
          createdAt: serverTimestamp()
        });
      })
      .then(() => {
        localStorage.setItem("uploadedImagesCount", uploadedImagesCount + 1);
        localStorage.setItem("lastUploadDate", new Date().toISOString());

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your image has been successfully uploaded.",
          customClass: {
            container: "sweet-alert-container",
          },
        });
        setImageUpload(null); // Reset gambar di pratinjau kembali ke tanda (+)
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat mengunggah gambar.",
          customClass: { container: "sweet-alert-container" },
        });
      });
  };

  const handleImageChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="text-1xl md:text-2xl md:px-10 font-bold mb-4 w-full text-white">
          Upload Your Classroom Memories
        </h1>
      </div>

      <div className="mx-auto p-4">
        <form>
          <div className="mb-4">
            <input type="file" id="imageUpload" className="hidden" onChange={handleImageChange} />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer border-dashed border-2 border-gray-400 rounded-lg p-4 w-56 h-auto flex items-center justify-center">
              {imageUpload ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={URL.createObjectURL(imageUpload)}
                    alt="Preview Gambar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-center px-5 py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-12 w-12 mx-auto text-gray-400">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-white opacity-60">Click to select an image</p>
                </div>
              )}
            </label>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="py-2.5 w-[60%] mb-0 md:mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={uploadImage}>
        UPLOAD
      </button>
    </div>
  )
}

export default UploadImage;