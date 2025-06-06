const express = require("express");
const router = express.Router();

// Controller
const Auth = require("../controllers/authControllers");

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/refresh-token", Auth.refreshToken);
router.delete("/logout", Auth.logout);

module.exports = router;
