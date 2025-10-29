const HeroContent = require("../models/HeroContent");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
exports.getHeroContent = async (req, res) => {
	try {
		let heroContent = await HeroContent.findOne();

		// Create default if doesn't exist
		if (!heroContent) {
			heroContent = await HeroContent.create({});
		}

		res.json({
			success: true,
			data: heroContent,
		});
	} catch (error) {
		console.error("Get hero content error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching hero content",
		});
	}
};

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Private (Admin)
exports.updateHeroContent = async (req, res) => {
	try {
		const { title, subtitle, description } = req.body;

		let heroContent = await HeroContent.findOne();

		if (!heroContent) {
			heroContent = await HeroContent.create({});
		}

		// Update fields
		if (title) heroContent.title = title;
		if (subtitle) heroContent.subtitle = subtitle;
		if (description) heroContent.description = description;

		// Update hero image if uploaded
		if (req.file) {
			if (heroContent.heroImagePublicId) {
				try {
					await cloudinary.uploader.destroy(heroContent.heroImagePublicId);
				} catch (cleanupError) {
					console.error(
						"Error deleting previous hero image from Cloudinary:",
						cleanupError
					);
				}
			} else if (heroContent.heroImage) {
				const oldImagePath = path.join(__dirname, "..", heroContent.heroImage);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			heroContent.heroImage = req.file.path;
			heroContent.heroImagePublicId = req.file.filename;
		}

		await heroContent.save();

		res.json({
			success: true,
			message: "Hero content updated successfully",
			data: heroContent,
		});
	} catch (error) {
		console.error("Update hero content error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while updating hero content",
		});
	}
};
