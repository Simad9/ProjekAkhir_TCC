const express = require("express");
const router = express.Router();

// Controller
const Keranjang = require("../controllers/keranjangControllers");

router.get("/", Keranjang.getKeranjang);
router.get("/:id", Keranjang.getKeranjangById);
router.post("/", Keranjang.createKeranjang);
router.put("/:id", Keranjang.updateKeranjang);
router.patch("/:id", Keranjang.updateKeranjang);
router.delete("/:id", Keranjang.deleteKeranjang);

module.exports = router;
