const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  createContact,
  getAllContacts,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");

// Public route
router.post("/", createContact);

// Protected routes (Admin only)
router.get("/", authMiddleware, getAllContacts);
router.put("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteContact);

module.exports = router;
