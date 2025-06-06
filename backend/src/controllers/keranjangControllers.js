const Keranjang = require("../models/keranjangModels");

//  getKeranjang
const getKeranjang = async (req, res) => {
  try {
    const result = await Keranjang.getKeranjang();
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

// getKeranjangById
const getKeranjangById = async (req, res) => {
  try {
    const keranjangId = parseInt(req.params.id);
    const data = await Keranjang.getKeranjangById(keranjangId);
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

// createKeranjang
const createKeranjang = async (req, res) => {
  try {
    const data = req.body;
    const result = await Keranjang.createKeranjang(data);
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

// updateKeranjang
const updateKeranjang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const result = await Keranjang.updateKeranjang(id, data);
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

// deleteKeranjang
const deleteKeranjang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Keranjang.deleteKeranjang(id);
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
  getKeranjang,
  getKeranjangById,
  createKeranjang,
  updateKeranjang,
  deleteKeranjang,
};
