const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  createBeneficiaryCard,
  verifyBeneficiaryCard,
  getAllBeneficiaryCards,
  deleteBeneficiaryCard,
} = require("../controllers/beneficiaryController");

// Public routes
router.post("/", upload.single("photo"), createBeneficiaryCard);
router.post("/verify", verifyBeneficiaryCard);

// Protected routes (Admin only)
router.get("/", authMiddleware, getAllBeneficiaryCards);
router.delete("/:id", authMiddleware, deleteBeneficiaryCard);

module.exports = router;
