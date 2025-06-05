const express = require("express");
const router = express.Router();

// Controller
const Menu = require("../controllers/menuController");

router.get("/", Menu.getMenu);
router.get("/:id", Menu.getMenuById);
router.post("/", Menu.createMenu);
router.put("/:id", Menu.updateMenu);
router.patch("/:id", Menu.updateMenu);
router.delete("/:id", Menu.deleteMenu);

module.exports = router;
