const User = require("../models/userModels");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Register
const register = async (req, res) => {
  try {
    const data = req.body;

    // Password Validasi
    if (data.password != data.confirm_password) {
      return res.status(400).json({
        message: "Password dan Confirm Password harus sama",
      });
    }

    // Cek Akun
    const existingUser = await User.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({
        message: "Username harus unik",
      });
    }

    // Hash Password
    data.password = bycrypt.hashSync(data.password, 5);

    const dataForm = {
      username: data.username,
      password: data.password,
    };

    // Query
    const result = await User.createUser(dataForm);

    // Response
    res.status(201).json({
      message: "Succes berhasil Register",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const data = req.body;

    // Cek Akun
    const result = await User.getUserByUsername(data.username);
    if (!result) {
      return res.status(404).json({
        message: "Akun tidak ditemukan",
      });
    }

    // Compate Password
    if (!bycrypt.compareSync(data.password, result.password)) {
      return res.status(401).json({
        message: "Password Salah",
      });
    }

    // JWT Sign
    const accessToken = jwt.sign(
      { userId: result.id_user, username: result.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: result.id_user, username: result.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Update Refresh Token + Cookie
    res.cookie("refreshCookie", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Update Data
    const DataForm = {
      username: result.username,
      password: result.password,
      refresh_token: refreshToken,
    };

    // update refreshToken
    await User.updateById(result.id_user, DataForm);

    // Response
    res.status(200).json({
      message: "Succes berhasil Login",
      data: {
        id: result.id,
        username: result.username,
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    // Cookie Validation
    const refreshToken = req.cookies.refreshCookie;

    // Cek Cookie
    if (!refreshToken) {
      return res.status(401).json({
        message: "Anda belum login",
      });
    }

    // Cek User Validation
    const user = await User.getUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(403).json({
        message: "Anda belum login",
      });
    }

    // Verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { userId: user.id_user, username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        // Response
        res.status(200).json({
          message: "Success Ini Token lagi",
          data: {
            id: user.id,
            username: user.username,
            token: accessToken,
          },
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Terjadi Kesalahan",
      error: error.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshCookie;

    // Belum Login
    if (!refreshToken) {
      return res.status(401).json({
        message: "Anda belum login",
      });
    }

    // Cek User Validation
    const user = await User.getUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(403).json({
        message: "Anda belum login",
      });
    }

    // Set up data
    const data = {
      refresh_token: null,
    };

    // Ganti Refresh Token
    const result = await User.updateByRefreshToken(refreshToken, data);

    // Menghapus refresh cookie
    res.clearCookie("refreshCookie");

    res.status(200).json({
      message: "Berhasil Logout",
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
  register,
  login,
  refreshToken,
  logout,
};
