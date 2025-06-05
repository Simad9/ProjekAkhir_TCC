const express = require("express");
const router = express.Router();

// Controller
const PesanDetail = require("../controllers/pesanDetailControllers");

router.get("/", PesanDetail.getPesanDetail);
router.get("/:id", PesanDetail.getPesanDetailById);
router.post("/", PesanDetail.createPesanDetail);
router.put("/:id", PesanDetail.updatePesanDetail);
router.patch("/:id", PesanDetail.updatePesanDetail);
router.delete("/:id", PesanDetail.deletePesanDetail);

module.exports = router;