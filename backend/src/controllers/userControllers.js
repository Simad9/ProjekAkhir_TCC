const User = require("../models/userModels");

// getUser
const getUser = async (req, res) => {
  try {
    const result = await User.getUser();
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

// getUserById
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.getUserById(id);
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

// createUser
const createUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await User.createUser(data);
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

// updateUser
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await User.updateUser(id, data);
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

// deleteUser
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.deleteUser(id);
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
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
