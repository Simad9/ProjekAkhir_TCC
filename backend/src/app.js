const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// App Express
const app = express();
// Dotenv
dotenv.config();

// Konfigurasi CORS agar mengizinkan domain frontend terdeploy
const corsOptions = {
  origin: [
    "http://localhost:3000", // Tambahkan localhost untuk pengembangan lokal
    "http://35.224.10.244", // Frontend yang di-deploy ke VM
  ],
  credentials: true, // Memungkinkan penggunaan cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); // Menggunakan opsi CORS
// Menambahkan penanganan preflight request (OPTIONS)
app.options("*", cors(corsOptions)); // Menanggapi preflight requests

app.use(cookieParser());
app.use(express.json());

// Routes
const Routes = require("./routes/routes.js");
app.use("/api/", Routes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).send({ message: "Halaman tidak ditemukan" });
});

module.exports = app;
