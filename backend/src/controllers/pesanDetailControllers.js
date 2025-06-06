const pesanDetail = require("../models/pesanDetailModels");

// getPesanDetail
const getPesanDetail = async (req, res) => {
  try {
    const result = await pesanDetail.getPesanDetail();
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

// getPesanDetailById
const getPesanDetailById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pesanDetail.getPesanDetailById(id);
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

// createPesanDetail
const createPesanDetail = async (req, res) => {
  try {
    const data = req.body;
    const result = await pesanDetail.createPesanDetail(data);
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

// updatePesanDetail
const updatePesanDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const result = await pesanDetail.updatePesanDetail(id, data);
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

// deletePesanDetail
const deletePesanDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pesanDetail.deletePesanDetail(id);
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
  getPesanDetail,
  getPesanDetailById,
  createPesanDetail,
  updatePesanDetail,
  deletePesanDetail,
};
