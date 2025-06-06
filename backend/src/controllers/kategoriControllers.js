const Kategori = require("../models/kategoriModels");

//  getKategori,
const getKategori = async (req, res) => {
  try {
    const data = await Kategori.getKategori();
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

//   getKategoriById,
const getKategoriById = async (req, res) => {
  try {
    const ketgoriId = parseInt(req.params.id);
    const data = await Kategori.getKategoriById(ketgoriId);
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

//   createKategori,
const createKategori = async (req, res) => {
  try {
    const data = req.body;
    const result = await Kategori.createKategori(data);
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

//   updateKategori,
const updateKategori = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const result = await Kategori.updateKategori(id, data);
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

//   deleteKategori,
const deleteKategori = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Kategori.deleteKategori(id);
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
  getKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
};
