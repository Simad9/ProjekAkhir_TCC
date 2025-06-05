const express = require("express");
const router = express.Router();

// Controller
const mahasiswaRoutes = require("./mahasiswaRoutes");

app.use("/mahasiswa", mahasiswaRoutes);

module.exports = router;