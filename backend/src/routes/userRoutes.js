const express = require("express");
const router = express.Router();

// Controller
const User = require("../controllers/userControllers");

router.get("/", User.getUser);
router.get("/:id", User.getUserById);
router.post("/", User.createUser);
router.put("/:id", User.updateUser);
router.patch("/:id", User.updateUser);
router.delete("/:id", User.deleteUser);

module.exports = router;
