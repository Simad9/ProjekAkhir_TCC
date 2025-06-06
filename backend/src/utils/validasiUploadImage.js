const fs = require("fs");
const path = require("path");
const uploadToCloudService = require("./uploadFiles"); // ganti dengan fungsi upload ke cloud yang sesuai

const validasiUploadImage = async (fileInput) => {
  try {
    const tempPath = fileInput.path;
    const originalName = fileInput.originalname;

    // 1. Validasi
    const ext = path.extname(originalName).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      fs.unlinkSync(tempPath);
      return res.status(400).json({ message: "Format tidak didukung" });
    }
    if (fileInput.size > 5000000) {
      fs.unlinkSync(tempPath);
      return res.status(400).json({ message: "File harus di bawah 5MB" });
    }
    // 2. Upload ke cloud (dummy logic, ganti pakai API Cloudinary, Firebase, etc.)
    const cloudUrl = await uploadToCloudService(tempPath); // ini fungsi async kamu
    // 3. Hapus file lokal
    fs.unlinkSync(tempPath);

    return cloudUrl;
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

module.exports = validasiUploadImage;
