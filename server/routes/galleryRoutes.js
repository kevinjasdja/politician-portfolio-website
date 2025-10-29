const express = require("express");
const router = express.Router();
const {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
} = require("../controllers/galleryController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes (admin only)
router.post("/", authMiddleware, upload.array("images", 10), createPost);
router.put("/:id", authMiddleware, upload.array("images", 10), updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
