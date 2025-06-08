import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import { userService } from "../api/orderService";
import { FiArrowLeft, FiUser, FiSave, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username, userId: contextUserId, logout, updateUsername } = useAuthContext();
  
  const [profileData, setProfileData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Initialize profile data with current username
    setProfileData(prev => ({
      ...prev,
      username: username || ""
    }));
    
    // Use userId from auth context or fallback to localStorage
    const userIdToUse = contextUserId || localStorage.getItem('userId') || 10; // Default to 10 for testing
    console.log('ProfilePage - contextUserId:', contextUserId);
    console.log('ProfilePage - localStorage userId:', localStorage.getItem('userId'));
    console.log('ProfilePage - userIdToUse:', userIdToUse);
    setUserId(userIdToUse);
  }, [username, contextUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!profileData.username.trim()) {
      setError("Username tidak boleh kosong");
      setIsLoading(false);
      return;
    }

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (profileData.newPassword && profileData.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    if (profileData.newPassword && !profileData.currentPassword) {
      setError("Password lama diperlukan untuk mengubah password");
      setIsLoading(false);
      return;
    }

        try {
      // Langkah 1: Validasi password lama terlebih dahulu
      console.log('Validating current password...');
      try {
        const loginValidation = await userService.validateCurrentPassword(
          username, // Gunakan username asli dari context, bukan dari form input 
          profileData.currentPassword
        );
        
        if (!loginValidation.isValid) {
          setError("Password lama salah! Masukkan password yang benar.");
          setIsLoading(false);
          return;
        }
        
        console.log('Current password validated successfully');
      } catch (validationError) {
        console.error('Password validation failed:', validationError);
        setError("Password lama salah! Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // Langkah 2: Siapkan data update
      let updateData;
      
      if (profileData.newPassword) {
        // Mengubah username dan password
        updateData = {
          username: profileData.username.trim(),
          password: profileData.newPassword
        };
        console.log('Update profile (username + new password)');
      } else {
        // Hanya update username - gunakan password lama
        updateData = {
          username: profileData.username.trim(),
          password: profileData.currentPassword
        };
        console.log('Update profile (username only)');
      }

      console.log('- userId:', userId);
      console.log('- updateData:', updateData);
      
      const response = await userService.updateProfile(userId, updateData);
      
      if (response.message === "success") {
        setSuccess("Profil berhasil diperbarui!");
        
        // Update username di context jika username berubah
        if (updateData.username !== username) {
          updateUsername(updateData.username);
        }
        
        // Bersihkan field password setelah update berhasil
        setProfileData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setError(
        error.response?.data?.message || 
        "Gagal memperbarui profil. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const deleteData = {
        username: profileData.username,
        password: profileData.currentPassword
      };

      const response = await userService.deleteAccount(userId, deleteData);

      if (response.data.message === "success") {
        setSuccess("Akun berhasil dihapus!");
        // Logout user setelah berhasil hapus akun
        setTimeout(async () => {
          await logout();
          navigate("/register");
        }, 2000);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      setError(
        error.response?.data?.message || 
        "Gagal menghapus akun. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
              <h1 className="text-2xl font-bold text-blue-600">Kelola Profil</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">Hello, {username}!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-8">
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                <FiUser className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                <p className="text-gray-600">Kelola informasi akun Anda</p>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}



            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>



                            {/* Current Password Field */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Password Lama (Diperlukan untuk update profil) *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Masukkan password lama"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru (Kosongkan jika tidak ingin mengubah)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              {profileData.newPassword && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Konfirmasi password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading || !profileData.currentPassword || (profileData.newPassword && !profileData.confirmPassword)}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-blue-400"
                >
                  <FiSave className="w-5 h-5 mr-2" />
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  Hapus Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Konfirmasi Hapus Akun
            </h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dikembalikan.
            </p>
            <p className="text-gray-600 mb-4">
              Masukkan password Anda untuk konfirmasi:
            </p>
            <div className="relative mb-6">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || !profileData.currentPassword}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-red-400"
              >
                {isLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProfileData(prev => ({...prev, currentPassword: ""}));
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 