import axios from './AxiosInstance';

export const orderService = {
  // Kirim pesanan baru (2 langkah: Pesanan + Pesan_Detail)
  submitOrder: async (orderData) => {
    console.log('Creating order with 2-step process...');
          console.log('Order data:', orderData);
    
    try {
      // Langkah 1: Buat pesanan utama (Pesanan)
      // Sementara, gunakan menu pertama sebagai menu utama (masalah desain database)
      const firstMenuItem = orderData.cart[0];
      const pesananData = {
        total_harga: orderData.total_harga,
        status: "Konfirmasi", // Status default - harus sesuai enum
        userId_user: orderData.userId_user,
        menuId_menu: firstMenuItem.id_menu || firstMenuItem.id // Diperlukan oleh skema database
      };
      
      console.log('Creating pesanan:', pesananData);
      const pesananResponse = await axios.post('/api/pesanan', pesananData);
      console.log('Pesanan created:', pesananResponse.data);
      
      if (!pesananResponse.data || !pesananResponse.data.data || !pesananResponse.data.data.id_pesanan) {
        throw new Error('Failed to get pesanan ID from response');
      }
      
      const pesananId = pesananResponse.data.data.id_pesanan;
      console.log('Got pesanan ID:', pesananId);
      
      // Langkah 2: Buat detail pesanan (Pesan_Detail) untuk setiap item keranjang
      const detailPromises = orderData.cart.map(async (item) => {
        const detailData = {
          jumlah: item.quantity,
          catatan: item.note || "tidak ada",
          menuId_menu: item.id_menu || item.id, // Fallback ke id jika id_menu tidak ada
          pesananId_pesanan: pesananId
        };
        
        console.log('Creating pesan detail:', detailData);
        const detailResponse = await axios.post('/api/pesanDetail', detailData);
        console.log('Pesan detail created:', detailResponse.data);
        return detailResponse.data;
      });
      
      // Tunggu semua detail selesai dibuat
      const detailResults = await Promise.all(detailPromises);
      console.log('All pesan details created:', detailResults);
      
      return {
        message: "success",
        data: {
          pesanan: pesananResponse.data.data,
          details: detailResults
        }
      };
      
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Ambil riwayat pesanan user  
  getOrderHistory: async (userId) => {
    try {
      // Ambil semua pesanan lalu filter berdasarkan userId di frontend
      const response = await axios.get('/api/pesanan');
      console.log('All pesanan response:', response.data);
      
      if (response.data && response.data.data) {
        // Filter pesanan berdasarkan userId_user
        const userOrders = response.data.data.filter(order => order.userId_user == userId);
        console.log(`Filtered orders for user ${userId}:`, userOrders);
        
        return {
          success: true,
          data: userOrders
        };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Get order history error:', error);
      // Return array kosong jika API tidak tersedia
      return { success: true, data: [] };
    }
  },

  // Ambil detail pesanan (Pesan_Detail) untuk pesanan tertentu dengan info menu
  getOrderDetails: async (orderId) => {
    try {
      console.log(`Fetching details for order ${orderId}`);
      
              // Ambil semua detail pesanan
      const detailsResponse = await axios.get('/api/pesanDetail');
      console.log('All pesan detail response:', detailsResponse.data);
      
      if (detailsResponse.data && detailsResponse.data.data) {
        // Filter detail berdasarkan pesananId_pesanan
        const orderDetails = detailsResponse.data.data.filter(detail => detail.pesananId_pesanan == orderId);
        console.log(`Filtered details for order ${orderId}:`, orderDetails);
        
                  // Ambil info menu untuk setiap detail
        try {
          const menuResponse = await axios.get('/api/menu');
          if (menuResponse.data && menuResponse.data.data) {
            const menuItems = menuResponse.data.data;
            
            // Lampirkan info menu ke setiap detail
            const detailsWithMenu = orderDetails.map(detail => {
              const menuItem = menuItems.find(menu => menu.id_menu == detail.menuId_menu);
              return {
                ...detail,
                menu: menuItem || null
              };
            });
            
            return {
              success: true,
              data: detailsWithMenu
            };
          }
        } catch (menuError) {
          console.error('Error fetching menu info:', menuError);
        }
        
                  // Return detail tanpa info menu jika gagal ambil menu
        return {
          success: true,
          data: orderDetails
        };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Get order details error:', error);
      return { success: true, data: [] };
    }
  },

  // Get order details by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`/api/pesanan/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Update order status (for cancel, etc)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(`/api/pesanan/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }
};

export const menuService = {
  // Get all menu items from API
  getMenuItems: async () => {
    try {
      console.log('Attempting to fetch menu from /api/menu');
      const response = await axios.get('/api/menu');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get menu items error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Try alternative endpoints if main one fails
      const alternativeEndpoints = [
        '/api/menus', 
        '/menu', 
        '/menus',
        '/api/Menu', // Case sensitive check
        '/api/makanan' // Previous endpoint we used
      ];
      
      for (const endpoint of alternativeEndpoints) {
        try {
          console.log(`Trying alternative endpoint: ${endpoint}`);
          const altResponse = await axios.get(endpoint);
          console.log(`Success with ${endpoint}:`, altResponse.data);
          return altResponse.data;
        } catch (altError) {
          console.log(`Failed with ${endpoint}:`, altError.response?.status);
          continue;
        }
      }
      
      console.error('All endpoints failed');
      throw error;
    }
  },

  // Get menu item by ID
  getMenuItemById: async (itemId) => {
    try {
      const response = await axios.get(`/api/menu/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Get menu item by ID error:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await axios.get('/api/kategori');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }
};

export const userService = {
  // Validasi password lama dengan mencoba login
  validateCurrentPassword: async (username, currentPassword) => {
    try {
      console.log('Validating password via login endpoint...');
      
      // Gunakan endpoint login untuk validasi password
      const response = await axios.post('/api/login', {
        username: username,
        password: currentPassword
      });
      
      console.log('Login validation response:', response.data);
      
      if (response.data && response.data.message && 
          (response.data.message.includes('berhasil') || response.data.message === 'success')) {
        return { isValid: true };
      }
      
      return { isValid: false };
    } catch (error) {
      console.error('Password validation error:', error);
      
      // Jika 401 (unauthorized) atau 404 (user tidak ditemukan), kredensial tidak valid
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log('Invalid credentials - password wrong or user not found');
        return { isValid: false };
      }
      
      // Cek pesan error password spesifik
      if (error.response?.data?.message?.includes('Password Salah') ||
          error.response?.data?.message?.includes('Akun tidak ditemukan')) {
        console.log('Invalid credentials - wrong password or username');
        return { isValid: false };
      }
      
      // Error lain (seperti masalah jaringan) harus di-throw
      console.error('Unexpected validation error:', error.message);
      throw error;
    }
  },

  // Update profil user
  updateProfile: async (userId, userData) => {
    try {
      console.log('UserService - updateProfile called with:');
      console.log('- userId:', userId);
      console.log('- userData:', userData);
      console.log('- API endpoint:', `/api/user/${userId}`);
      
      const response = await axios.put(`/api/user/${userId}`, userData);
      console.log('UserService - updateProfile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Berikan pesan error yang lebih spesifik
      if (error.response?.status === 500) {
        throw new Error('Server error: Mungkin ada masalah dengan format data atau server sedang bermasalah');
      } else if (error.response?.status === 400) {
        throw new Error('Data tidak valid: ' + (error.response?.data?.message || 'Periksa data yang Anda masukkan'));
      } else if (error.response?.status === 401) {
        throw new Error('Tidak terotorisasi: Silakan login ulang');
      } else if (error.response?.status === 404) {
        throw new Error('User tidak ditemukan');
      }
      throw error;
    }
  },

  // Hapus akun user
  deleteAccount: async (userId, userData) => {
    try {
      const response = await axios.delete(`/api/user/${userId}`, {
        data: userData
      });
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // Ambil profil user
  getProfile: async (userId) => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};

export default {
  orderService,
  menuService,
  userService
}; 