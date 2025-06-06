const Menu = require("../models/menuModels");
const validasiUploadImage = require("../utils/validasiUploadImage");

// getMenu
const getMenu = async (req, res) => {
  try {
    const result = await Menu.getMenu();

    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// getMenuById
const getMenuById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Menu.getMenuById(id);
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// createMenu
const createMenu = async (req, res) => {
  try {
    const data = req.body;

    // Harga ubah jadi Int
    data.harga = parseInt(data.harga);

    // Kategori Id ubah jadi Int
    data.kategoriId_kategori = parseInt(data.kategoriId_kategori);

    // Tambah Gambar
    if (req.file) {
      data.gambar = await validasiUploadImage(req.file);
    }

    // Query
    const result = await Menu.createMenu(data);

    // Hasil
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// updateMenu
const updateMenu = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    // Harga ubah jadi Int
    data.harga = parseInt(data.harga);

    // Kategori Id ubah jadi Int
    data.kategoriId_kategori = parseInt(data.kategoriId_kategori);

    // Tambah Gambar
    if (req.file) {
      data.gambar = await validasiUploadImage(req.file);
    }

    // Query
    const result = await Menu.updateMenu(id, data);

    // Hasil
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// deleteMenu
const deleteMenu = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Menu.deleteMenu(id);
    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

module.exports = {
  getMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
