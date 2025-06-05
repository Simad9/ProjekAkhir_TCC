const express = require("express");
const router = express.Router();

// Controller
const Kategori = require("../controllers/kategoriControllers");

router.get("/", Kategori.getKategori);
router.get("/:id", Kategori.getKategoriById);
router.post("/", Kategori.createKategori);
router.put("/:id", Kategori.updateKategori);
router.patch("/:id", Kategori.updateKategori);
router.delete("/:id", Kategori.deleteKategori);

module.exports = router;
