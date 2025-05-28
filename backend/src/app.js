const express = require("express");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");

const app = express();

app.use(express.json());

app.use("/mahasiswa", mahasiswaRoutes);

module.exports = app;
