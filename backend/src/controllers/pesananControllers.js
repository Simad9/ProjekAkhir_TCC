const Pesanan = require("../models/pesananModels");

// getPesanan
const getPesanan = async (req, res) => {
  try {
    const result = await Pesanan.getPesanan();
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

// getPesananById
const getPesananById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Pesanan.getPesananById(id);
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

// createPesanan
const createPesanan = async (req, res) => {
  try {
    const data = req.body;
    const result = await Pesanan.createPesanan(data);
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

// updatePesanan
const updatePesanan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await Pesanan.updatePesanan(id, data);
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

// deletePesanan
const deletePesanan = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Pesanan.deletePesanan(id);
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
  getPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
};
