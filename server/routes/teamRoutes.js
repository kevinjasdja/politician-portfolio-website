const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

// Public route
router.get("/", getAllTeamMembers);

// Protected routes (Admin only)
router.post("/", authMiddleware, upload.single("image"), createTeamMember);
router.put("/:id", authMiddleware, upload.single("image"), updateTeamMember);
router.delete("/:id", authMiddleware, deleteTeamMember);

module.exports = router;
