import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/utils";

const InputMenuPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    gambar: null,
    imagePreview: null,
    nama_menu: "",
    deskripsi: "",
    harga: "",
    kategoriId_kategori: ""
  });

  // Menu categories
  const menuCategories = [
    { value: 1, label: "Makanan" },
    { value: 2, label: "Minuman" }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Format foto tidak valid. Gunakan PNG, JPG, atau JPEG');
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        alert('Ukuran foto maksimal 5MB');
        e.target.value = '';
        return;
      }

      setFormData({ 
        ...formData, 
        gambar: file,
        imagePreview: URL.createObjectURL(file)
      });

      return () => URL.revokeObjectURL(formData.imagePreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_menu || 
        !formData.deskripsi || 
        !formData.harga || 
        !formData.kategoriId_kategori || 
        !formData.gambar) {
      alert('Mohon lengkapi semua field');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("nama_menu", formData.nama_menu);
      data.append("deskripsi", formData.deskripsi);
      data.append("harga", parseInt(formData.harga));
      data.append("kategoriId_kategori", parseInt(formData.kategoriId_kategori));
      data.append("gambar", formData.gambar);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      };

      const response = await axios.post(`${BASE_URL}/menu`, data, config);

      if (response.data) {
        alert("Menu berhasil ditambahkan");
        navigate("/admin/menu"); 
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Gagal menambahkan menu. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/menu")} 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Kembali
        </button>
        <h1 className="text-2xl font-bold">Input Menu Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Foto Menu</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(formData.imagePreview);
                      setFormData({ 
                        ...formData, 
                        gambar: null,
                        imagePreview: null 
                      });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                    required
                  />
                  <label htmlFor="imageInput" className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 mx-auto mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span>Klik untuk upload foto menu</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Detail Menu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formData.nama_menu}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_menu: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga
                </label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) =>
                    setFormData({ ...formData, harga: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.kategoriId_kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategoriId_kategori: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {menuCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-6 disabled:bg-gray-400"
              >
                {isLoading ? "Menyimpan..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputMenuPage;
