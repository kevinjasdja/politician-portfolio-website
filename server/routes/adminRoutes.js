const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  login,
  getProfile,
  initAdmin,
} = require("../controllers/adminController");

// Public routes
router.post("/login", login);
router.post("/init", initAdmin); // For first-time setup only

// Protected routes
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
