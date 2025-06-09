import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          403 - Forbidden
        </h1>
        <p className="text-gray-600 mb-6">
          Maaf, Anda tidak memiliki akses ke halaman ini
        </p>
        <button
          onClick={handleGoBack}
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;