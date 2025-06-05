const express = require("express");
const router = express.Router();

// Controller
const Pesanan = require("../controllers/pesananControllers");

router.get("/", Pesanan.getPesanan);
router.get("/:id", Pesanan.getPesananById);
router.post("/", Pesanan.createPesanan);
router.put("/:id", Pesanan.updatePesanan);
router.patch("/:id", Pesanan.updatePesanan);
router.delete("/:id", Pesanan.deletePesanan);

module.exports = router;
