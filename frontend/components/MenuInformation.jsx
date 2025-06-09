// src/components/TourInformation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourInformation = ({ 
  tourDetail, 
  loggedInUserId, 
  onBookmark, 
  isBookmarked, 
  onDelete,  // Menggunakan 'onDelete' sesuai kode yang Anda berikan
  onEditTour // Prop untuk navigasi ke halaman edit (dari DetailTour)
}) => {
  const navigate = useNavigate(); // onEditTour dari DetailTour.jsx akan menggunakan ini
  
  if (!tourDetail) {
    console.log("[TourInformation] Render: tourDetail is null, returning null.");
    return null;
  }

  // Pengecekan apakah pengguna yang login adalah pemilik wisata
  // Pastikan tourDetail.userId dan loggedInUserId ada dan valid sebelum perbandingan
  const isOwner = tourDetail.userId != null && 
                  loggedInUserId != null && 
                  String(loggedInUserId) === String(tourDetail.userId);

  console.log(
    `[TourInformation] Render. Tour ID: ${tourDetail.id_wisata}. ` +
    `loggedInUserId: "${loggedInUserId}" (Tipe: ${typeof loggedInUserId}), ` +
    `OwnerId (tourDetail.userId): "${tourDetail.userId}" (Tipe: ${typeof tourDetail.userId}), ` +
    `IsOwner: ${isOwner}`
  );

  const handleDeleteClick = () => {
    console.log('[TourInformation] Tombol "Hapus Wisata" DIKLIK!'); // LOG SEBELUM MEMANGGIL onDelete
    if (typeof onDelete === 'function') {
      onDelete(); // Memanggil fungsi yang dioper dari DetailTour (yaitu handleDelete dari useTour)
    } else {
      console.error('[TourInformation] Prop "onDelete" bukan fungsi atau tidak terdefinisi. Nilai onDelete:', onDelete);
      alert("Fungsi untuk menghapus tidak tersedia.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img 
          src={tourDetail.foto_wisata} 
          alt={tourDetail.nama_wisata} 
          className="w-full h-64 object-cover" 
        />
        <div className="absolute bottom-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
          ⭐ {tourDetail.rating_wisata || "0"}
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{tourDetail.nama_wisata}</h2>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Lokasi: {tourDetail.lokasi_wisata}</span>
        </div>
        <p className="text-gray-700 mb-6">{tourDetail.deskripsi_wisata}</p>
        
        {/* Tombol Edit dan Hapus - hanya ditampilkan untuk pemilik wisata */}
        {isOwner && ( // Tombol hanya muncul jika isOwner true
          <div className="flex gap-3 mb-3">
            <button 
              onClick={onEditTour} // Menggunakan onEditTour yang dioper dari DetailTour
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {/* SVG Edit */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
              Edit Wisata
            </button>
            
            <button 
              onClick={handleDeleteClick} // Panggil handler lokal yang ada log-nya
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              {/* SVG Hapus */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              Hapus Wisata
            </button>
          </div>
        )}

        <button 
          onClick={onBookmark}
          className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
        >
          {/* SVG Bookmark */}
          <svg xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
          {isBookmarked ? 'Tersimpan' : 'Simpan ke Bookmark'}
        </button>
      </div>
    </div>
  );
};

export default TourInformation;