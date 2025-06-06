const Menu = require("../models/menuModels");

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
    const result = await Menu.createMenu(data);
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
    const result = await Menu.updateMenu(id, data);
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
