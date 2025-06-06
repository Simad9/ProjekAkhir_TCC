const express = require("express");
const router = express.Router();

// Controllers
const authRoute = require("./authRoutes");
const kategoriRoute = require("./kategoriRoutes");
const keranjangRoute = require("./keranjangRoutes");
const menuRoute = require("./menuRoutes");
const pesananRoute = require("./pesananRoutes");
const pesanDetailRoute = require("./pesanDetailRoutes");
const userRoute = require("./userRoutes");

// Routes
router.use("/", authRoute);
router.use("/kategori", kategoriRoute);
router.use("/keranjang", keranjangRoute);
router.use("/menu", menuRoute);
router.use("/pesanan", pesananRoute);
router.use("/pesanDetail", pesanDetailRoute);
router.use("/user", userRoute);

// == Testing Firebase ==
const mahasiswaRoutes = require("./mahasiswaRoutes");
router.use("/mahasiswa", mahasiswaRoutes);

module.exports = router;
