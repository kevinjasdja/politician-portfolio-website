const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  getHeroContent,
  updateHeroContent,
} = require("../controllers/heroController");

// Public route
router.get("/", getHeroContent);

// Protected route (Admin only)
router.put("/", authMiddleware, upload.single("heroImage"), updateHeroContent);

module.exports = router;
