const express = require("express");
const router = express.Router();
const multer = require("multer");

// Middleware
const upload = multer({ dest: "uploads/" });
const verifyToken = require("../middlewares/verifyToken");

// Controller
const Menu = require("../controllers/menuController");

router.get("/", Menu.getMenu);
router.get("/:id", Menu.getMenuById);
router.post("/", upload.single("gambar"), Menu.createMenu);
router.put("/:id", upload.single("gambar"), Menu.updateMenu);
router.patch("/:id", upload.single("gambar"), Menu.updateMenu);
router.delete("/:id", Menu.deleteMenu);

module.exports = router;
