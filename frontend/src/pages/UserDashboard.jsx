import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import { menuService, orderService } from "../api/orderService";
import { apiTester } from "../utils/apiTester";
import { FiUser, FiShoppingCart, FiLogOut, FiClock, FiStar } from "react-icons/fi";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { username, userId, logout } = useAuthContext();

  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Fetch menu items from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMenu(true);
        console.log('Fetching menu items and categories for dashboard...');

        // Fetch both menu and categories in parallel
        const [menuResponse, categoryResponse] = await Promise.all([
          menuService.getMenuItems(),
          menuService.getCategories()
        ]);

        console.log('Dashboard Menu API response:', menuResponse);
        console.log('Dashboard Category API response:', categoryResponse);

        // Create category mapping
        let categoryMap = {};
        if (categoryResponse && (categoryResponse.success || categoryResponse.data || Array.isArray(categoryResponse))) {
          let categoryData = categoryResponse.data || categoryResponse;
          if (Array.isArray(categoryResponse)) {
            categoryData = categoryResponse;
          }

          if (Array.isArray(categoryData)) {
            categoryData.forEach(cat => {
              const id = cat.id_kategori || cat.id;
              const name = cat.nama_kategori || cat.name || 'Tidak dikategorikan';
              categoryMap[id] = name;
              console.log(`Dashboard Category mapping: ${id} -> ${name}`);
            });
          }
        }
        console.log('Dashboard Final category map:', categoryMap);

        if (menuResponse && (menuResponse.success || menuResponse.data || Array.isArray(menuResponse))) {
          let menuData = menuResponse.data || menuResponse;

          // Handle if response is directly an array
          if (Array.isArray(menuResponse)) {
            menuData = menuResponse;
          }

          console.log('Dashboard Menu data:', menuData);

          if (Array.isArray(menuData) && menuData.length > 0) {
            // Transform API data to match database schema
            const transformedMenu = menuData.map(item => {
              console.log('Dashboard Processing menu item:', item);

              // Get category name from category mapping using kategoriId_kategori
              let categoryName = 'Tidak dikategorikan';
              const categoryId = item.kategoriId_kategori || item.categoryId || item.kategori_id;

              if (categoryId && categoryMap[categoryId]) {
                categoryName = categoryMap[categoryId];
              } else if (item.nama_kategori) {
                categoryName = item.nama_kategori;
              } else if (item.Kategori?.nama_kategori) {
                categoryName = item.Kategori.nama_kategori;
              } else if (item.kategori) {
                categoryName = item.kategori;
              } else if (item.category) {
                categoryName = item.category;
              }

              console.log(`Dashboard Item ${item.nama_menu} - categoryId: ${categoryId}, categoryName: ${categoryName}`);

              return {
                id: item.id_menu || item.id,
                name: item.nama_menu || item.name || 'Menu',
                price: item.harga || item.price || 0,
                description: item.deskripsi || item.description || 'Deskripsi tidak tersedia',
                image: item.gambar || item.image || '/api/placeholder/300/200',
                category: categoryName
              };
            });
            console.log('Dashboard Transformed menu:', transformedMenu);
            setMenuItems(transformedMenu.slice(0, 4)); // Show only first 4 items
          } else {
            console.log('No menu data found or empty array');
            setMenuItems([]);
          }
        } else {
          console.log('Invalid response format:', menuResponse);
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Fallback dengan sample data jika API belum tersedia
        setMenuItems([
          {
            id: 1,
            name: "Sample Menu 1",
            price: 15000,
            description: "API belum tersedia - sample data",
            image: "/api/placeholder/300/200",
            category: "Sample"
          }
        ]);
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchData();
  }, []);

  // Ambil data pesanan terbaru dengan detail menu
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!userId) return;

      try {
        setIsLoadingOrders(true);
        console.log('Fetching order history for userId:', userId);

        // Ambil riwayat pesanan
        const response = await orderService.getOrderHistory(userId);
        console.log('Order history response:', response);

        if (response.success && response.data) {
          // Urutkan berdasarkan yang terbaru
          const sortedOrders = response.data.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.updatedAt);
            const dateB = new Date(b.createdAt || b.updatedAt);
            return dateB - dateA; // Terbaru dulu
          });

          // Ambil detail pesanan dengan info menu
          const ordersWithDetails = await Promise.all(
            sortedOrders.map(async (order) => {
              try {
                // Ambil detail pesanan (Pesan_Detail) untuk order ini
                const detailsResponse = await orderService.getOrderDetails(order.id_pesanan);
                console.log(`Details for order ${order.id_pesanan}:`, detailsResponse);

                let itemsText = "Menu tidak tersedia";
                if (detailsResponse && detailsResponse.data && detailsResponse.data.length > 0) {
                  // Format daftar menu
                  itemsText = detailsResponse.data.map(detail => {
                    const menuName = detail.menu?.nama_menu || detail.Menu?.nama_menu || `Menu ID ${detail.menuId_menu}`;
                    return `${menuName} (${detail.jumlah}x)`;
                  }).join(', ');
                }

                return {
                  id: order.id_pesanan,
                  date: order.createdAt || order.updatedAt,
                  total: order.total_harga,
                  status: order.status,
                  items: itemsText
                };
              } catch (detailError) {
                console.error(`Error fetching details for order ${order.id_pesanan}:`, detailError);
                return {
                  id: order.id_pesanan,
                  date: order.createdAt || order.updatedAt,
                  total: order.total_harga,
                  status: order.status,
                  items: "Detail pesanan tidak tersedia"
                };
              }
            })
          );

          console.log('Transformed orders with details:', ordersWithDetails);
          setRecentOrders(ordersWithDetails);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setRecentOrders([]); // Set empty array on error
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchRecentOrders();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">RestoApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, {username}
          </h2>
          <p className="text-gray-600">
            Pilih menu favorit Anda dan nikmati pengalaman makan yang luar biasa!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/order"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            <div className="flex items-center">
              <FiShoppingCart className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Pesan Makanan</h3>
                <p className="text-blue-100">Buat pesanan baru</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            <div className="flex items-center">
              <FiUser className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Kelola Profil</h3>
                <p className="text-green-100">Edit informasi Anda</p>
              </div>
            </div>
          </Link>

          <div className="bg-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <FiClock className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Riwayat Pesanan</h3>
                <p className="text-orange-100">{recentOrders.length} pesanan terakhir</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Menu Populer</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoadingMenu ? (
                  // Loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                        <div className="flex justify-between">
                          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                      <div className="h-48 bg-gray-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <img src={item.image ?? "https://placehold.co/400"} alt="" className="w-full h-full object-cover" />
                          {/* <span className="text-sm">Menu Image</span> */}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <div className="text-gray-500 space-y-2">
                      <p className="text-lg font-medium">Tidak ada menu tersedia</p>
                      <p className="text-sm">Pastikan backend server sudah berjalan di port yang benar</p>
                      <div className="text-xs bg-gray-100 p-3 rounded-lg mt-4 text-left">
                        <p className="font-medium mb-2">Troubleshooting:</p>
                        <ul className="space-y-1">
                          <li>• Cek apakah backend server running</li>
                          <li>• Pastikan file .env berisi: VITE_API_URL=http://localhost:5000</li>
                          <li>• Cek console browser untuk error details</li>
                          <li>• Pastikan API endpoint /api/menu tersedia</li>
                        </ul>
                        <div className="mt-3 space-y-2">
                          <button
                            onClick={() => apiTester.testMenuEndpoint()}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          >
                            Test API Endpoints
                          </button>
                          <button
                            onClick={() => apiTester.testServerHealth()}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 ml-2"
                          >
                            Test Server Health
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/order"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  <FiShoppingCart className="w-5 h-5 mr-2" />
                  Lihat Semua Menu & Pesan
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {isLoadingOrders ? (
                  // Loading untuk pesanan
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-5 bg-gray-300 rounded w-20"></div>
                    </div>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('id-ID')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'Selesai'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Proses'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{order.items}</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Belum ada pesanan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 