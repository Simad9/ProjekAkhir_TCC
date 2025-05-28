const express = require("express");
const Mahasiswa = require("../controllers/mahasiswaController");

const router = express.Router();

router.get("/", Mahasiswa.getAllMahasiswa);
router.post("/", Mahasiswa.addMahasiswa);
router.put("/:id", Mahasiswa.updateMahasiswa);
router.delete("/:id", Mahasiswa.deleteMahasiswa);

module.exports = router;
