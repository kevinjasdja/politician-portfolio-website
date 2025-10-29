const GalleryPost = require("../models/GalleryPost");
const cloudinary = require("../config/cloudinary");

// Get all gallery posts
const getAllPosts = async (req, res) => {
	try {
		const posts = await GalleryPost.find().sort({ createdAt: -1 });
		res.json({ success: true, data: posts });
	} catch (error) {
		console.error("Error fetching gallery posts:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get single post
const getPostById = async (req, res) => {
	try {
		const post = await GalleryPost.findById(req.params.id);
		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}
		res.json({ success: true, data: post });
	} catch (error) {
		console.error("Error fetching post:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Create new post
const createPost = async (req, res) => {
	try {
		const { title, description, facebookLink } = req.body;

		if (!title || !description) {
			return res.status(400).json({
				success: false,
				message: "Title and description are required",
			});
		}

		if (!req.files || req.files.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "At least one image is required" });
		}

		// Get uploaded image URLs from Cloudinary
		const imageUrls = req.files.map((file) => file.path);

		const newPost = new GalleryPost({
			title,
			description,
			images: imageUrls,
			facebookLink: facebookLink || "",
		});

		await newPost.save();
		res.status(201).json({ success: true, data: newPost });
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Update post
const updatePost = async (req, res) => {
	try {
		const { title, description, facebookLink } = req.body;
		const post = await GalleryPost.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		// Update fields
		if (title) post.title = title;
		if (description) post.description = description;
		if (facebookLink !== undefined) post.facebookLink = facebookLink;

		// Upload new images if provided
		if (req.files && req.files.length > 0) {
			// Get uploaded image URLs from Cloudinary
			const imageUrls = req.files.map((file) => file.path);
			post.images = imageUrls;
		}

		await post.save();
		res.json({ success: true, data: post });
	} catch (error) {
		console.error("Error updating post:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Delete post
const deletePost = async (req, res) => {
	try {
		const post = await GalleryPost.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		// Delete images from Cloudinary
		for (const imageUrl of post.images) {
			if (imageUrl.includes("cloudinary.com")) {
				try {
					// Extract public_id from Cloudinary URL
					// URL format: https://res.cloudinary.com/cloud-name/image/upload/v123456/folder/public-id.ext
					const urlParts = imageUrl.split("/");
					const uploadIndex = urlParts.indexOf("upload");
					if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
						// Get everything after "upload/" and remove the file extension
						const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
						const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
						await cloudinary.uploader.destroy(publicId);
					}
				} catch (deleteError) {
					console.error("Error deleting image from Cloudinary:", deleteError);
					// Continue with post deletion even if image deletion fails
				}
			}
		}

		await GalleryPost.findByIdAndDelete(req.params.id);
		res.json({ success: true, message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
};
