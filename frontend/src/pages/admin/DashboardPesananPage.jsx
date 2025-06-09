import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/AxiosInstance";
import { BASE_URL } from "../../utils/utils.js";
import { useAuthContext } from "../../auth/AuthProvider";

const DashboardPesananPage = () => {
  const navigate = useNavigate();
  const { userId, logout, username } = useAuthContext();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simplified fetchOrders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axiosInstance.get(`${BASE_URL}/pesanan`);

      if (response.data?.data) {
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Modified handleUpdateStatus
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`${BASE_URL}/pesanan/${orderId}`, {
        status: newStatus
      });
      
      // Refresh immediately after successful update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      if (!error.response || error.response.status !== 500) {
        alert('Gagal mengubah status pesanan');
      }
      fetchOrders();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [userId, navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      if (typeof logout === 'function') {
        logout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const formatPrice = (price) => {
    // Mengubah angka menjadi format rupiah
    const formatter = price.toString().split('').reverse().join('');
    const formatted = formatter.match(/\d{1,3}/g);
    return `Rp ${formatted.join('.').split('').reverse().join('')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Array nama bulan dalam Bahasa Indonesia
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await axiosInstance.delete(`${BASE_URL}/pesanan/${orderId}`);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Gagal menghapus pesanan');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin/menu')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Menu Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Pesanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Pesan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id_pesanan}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id_pesanan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.updatedAt)} {/* Ganti waktu_pesan menjadi updatedAt */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.total_harga)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Diproses' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          {order.status === 'Konfirmasi' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id_pesanan, 'Proses')}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Setujui
                            </button>
                          )}
                          {order.status === 'Proses' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id_pesanan, 'Selesai')}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Selesai
                            </button>
                          )}
                          {order.status === 'Selesai' && (
                            <button
                              onClick={() => handleDeleteOrder(order.id_pesanan)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada pesanan ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPesananPage;