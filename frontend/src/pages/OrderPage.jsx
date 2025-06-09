import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import { menuService, orderService } from "../api/orderService";
import { FiArrowLeft, FiPlus, FiMinus, FiShoppingCart, FiStar, FiClock, FiDollarSign } from "react-icons/fi";

const OrderPage = () => {
  const navigate = useNavigate();
  const { username, userId } = useAuthContext();

  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Fetch menu items and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingMenu(true);
        console.log('Fetching menu items and categories for order page...');

        // Fetch both menu and categories in parallel
        const [menuResponse, categoryResponse] = await Promise.all([
          menuService.getMenuItems(),
          menuService.getCategories()
        ]);

        console.log('Menu API response:', menuResponse);
        console.log('Category API response:', categoryResponse);

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
              console.log(`Category mapping: ${id} -> ${name}`);
            });
          }
        }
        console.log('Final category map:', categoryMap);

        // Process menu data
        if (menuResponse && (menuResponse.success || menuResponse.data || Array.isArray(menuResponse))) {
          let menuData = menuResponse.data || menuResponse;

          // Handle if response is directly an array
          if (Array.isArray(menuResponse)) {
            menuData = menuResponse;
          }

          if (Array.isArray(menuData) && menuData.length > 0) {
            console.log('Raw menu data for transformation:', menuData);
            console.log('First menu item example:', menuData[0]);

            // Transform API data to match database schema
            const transformedMenu = menuData.map(item => {
              console.log('Processing menu item:', item);

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

              console.log(`Item ${item.nama_menu} - categoryId: ${categoryId}, categoryName: ${categoryName}`);

              return {
                id: item.id_menu || item.id,
                name: item.nama_menu || item.name || 'Menu',
                price: item.harga || item.price || 0,
                description: item.deskripsi || item.description || 'Deskripsi tidak tersedia',
                image: item.gambar || item.image || '/api/placeholder/300/200',
                category: categoryName,
                available: true // Default available since not in database schema
              };
            });

            console.log('Transformed menu with categories:', transformedMenu);
            setMenuItems(transformedMenu);
          } else {
            setMenuItems([]);
          }
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response?.data || error.message);
        setMenuItems([]); // Set empty array on error
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories
  const categories = ["Semua", ...new Set(menuItems.map(item => item.category))];
  console.log('Final categories for filter buttons:', categories);

  // Filter menu items by category
  const filteredMenuItems = selectedCategory === "Semua"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1, note: "" }];
      }
    });
  };

  const updateCartItemNote = (itemId, note) => {
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.id === itemId ? { ...cartItem, note } : cartItem
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong! Pilih menu terlebih dahulu.");
      return;
    }

    console.log('Order Submit - userId from context:', userId);
    console.log('Order Submit - userId from localStorage:', localStorage.getItem('userId'));
    console.log('Order Submit - username from context:', username);

    const userIdToUse = userId || localStorage.getItem('userId');
    if (!userIdToUse) {
      alert("User ID tidak ditemukan. Silakan login ulang.");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        userId_user: parseInt(userIdToUse),
        total_harga: getTotalPrice(),
        status: "Konfirmasi",
        cart: cart.map(item => ({
          id_menu: item.id_menu || item.id, // Gunakan nama field yang sesuai database
          quantity: item.quantity,
          note: item.note?.trim() || "tidak ada"
        }))
      };

      console.log("Submitting order:", orderData);

      // Coba kirim ke API
      try {
        const response = await orderService.submitOrder(orderData);
        console.log("Order submitted successfully:", response);

        // Hanya tampilkan sukses jika API call berhasil
        setShowOrderModal(true);
      } catch (apiError) {
        console.error("Order submission failed:", apiError);

        // Tampilkan pesan error spesifik
        if (apiError.response?.status === 500) {
          alert("Server error: Gagal membuat pesanan. Silakan coba lagi atau hubungi admin.");
        } else if (apiError.response?.status === 400) {
          alert("Data pesanan tidak valid. Periksa kembali pesanan Anda.");
        } else {
          alert("Gagal mengirim pesanan. Periksa koneksi internet atau coba lagi.");
        }
        return; // Jangan tampilkan modal sukses
      }

    } catch (error) {
      console.error("Order submission error:", error);
      alert("Gagal mengirim pesanan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setShowOrderModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-blue-600 transition mr-4"
              >
                <FiArrowLeft className="w-5 h-5 mr-1" />
                <span>Kembali</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Pesan Makanan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {username}!</span>
              {cart.length > 0 && (
                <div className="relative">
                  <FiShoppingCart className="w-6 h-6 text-blue-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className={`bg-white rounded-xl shadow-lg overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <img src={item.image ?? "https://placehold.co/400"} alt="" className="w-full h-full object-cover" />
                      {/* <span className="text-sm">Menu Image</span> */}
                    </div>
                    {!item.available && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Habis
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    {item.available ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={getItemQuantity(item.id) === 0}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {getItemQuantity(item.id)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        {getItemQuantity(item.id) === 0 && (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                          >
                            Tambah
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-2">
                        Menu tidak tersedia
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Keranjang Pesanan</h3>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Keranjang kosong</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-blue-600 text-sm font-semibold">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Per-item note */}
                        <div className="mt-2">
                          <textarea
                            value={item.note || ""}
                            onChange={(e) => updateCartItemNote(item.id, e.target.value)}
                            placeholder="Catatan untuk item ini..."
                            className="w-full px-2 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>



                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Item:</span>
                      <span className="font-semibold">{getTotalItems()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-blue-400 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span>Memproses...</span>
                    ) : (
                      <>
                        <FiShoppingCart className="w-5 h-5 mr-2" />
                        Buat Pesanan
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pesanan Berhasil!
              </h3>
              <p className="text-gray-600 mb-6">
                Pesanan Anda telah diterima dan sedang diproses.
                Anda akan mendapat notifikasi ketika pesanan siap.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Item:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Bayar:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
              <button
                onClick={handleOrderSuccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage; 