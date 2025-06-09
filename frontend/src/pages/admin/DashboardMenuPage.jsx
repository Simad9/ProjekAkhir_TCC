import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { BASE_URL } from "../../utils/utils.js";
import { useAuthContext } from "../../auth/AuthProvider";

const DashboardMenuPage = () => {
  const navigate = useNavigate();
  const { userId, logout } = useAuthContext();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axiosInstance.get(`${BASE_URL}/menu`);

      if (response.data?.data) {
        setMenus(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      setError(error.message || "Failed to load menus");
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    fetchMenus();
  }, [userId, navigate]);

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await axiosInstance.delete(`${BASE_URL}/menu/${menuId}`);
        alert("Menu berhasil dihapus");
        fetchMenus();
      } catch (error) {
        console.error("Error deleting menu:", error);
        alert("Gagal menghapus menu");
      }
    }
  };

  const formatPrice = (price) => {
    const formatter = price.toString().split("").reverse().join("");
    const formatted = formatter.match(/\d{1,3}/g);
    return `Rp ${formatted.join(".").split("").reverse().join("")}`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Daftar Menu</h1>
            {/* Header buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Kelola Pesanan
              </button>
              <button
                onClick={() => navigate("/admin/input-menu")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Tambah Menu
              </button>
              <button
                onClick={() => handleLogout()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Menu List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div
                  key={menu.id_menu}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={menu.gambar}
                    alt={menu.nama_menu}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {menu.nama_menu}
                    </h3>
                    <p className="text-gray-600 mt-1">{menu.deskripsi}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {formatPrice(menu.harga)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/admin/edit-menu/${menu.id_menu}`)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.id_menu)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && menus.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada menu ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMenuPage;
