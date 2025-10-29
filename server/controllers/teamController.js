const TeamMember = require("../models/TeamMember");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getAllTeamMembers = async (req, res) => {
	try {
		const teamMembers = await TeamMember.find().sort({
			order: 1,
			createdAt: -1,
		});

		res.json({
			success: true,
			count: teamMembers.length,
			data: teamMembers,
		});
	} catch (error) {
		console.error("Get team members error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching team members",
		});
	}
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private (Admin)
exports.createTeamMember = async (req, res) => {
	try {
		const { name, mobile, position, order } = req.body;

		// Validate input
		if (!name || !mobile) {
			return res.status(400).json({
				success: false,
				message: "Please provide name and mobile number",
			});
		}

		// Check if image was uploaded
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Please upload an image",
			});
		}

		// Create team member
		const teamMember = await TeamMember.create({
			name,
			mobile,
			position: position || "Team Member",
			order: order || 0,
			image: req.file.path,
			imagePublicId: req.file.filename,
		});

		res.status(201).json({
			success: true,
			message: "Team member added successfully",
			data: teamMember,
		});
	} catch (error) {
		console.error("Create team member error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while creating team member",
		});
	}
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
exports.updateTeamMember = async (req, res) => {
	try {
		const { name, mobile, position, order } = req.body;

		const teamMember = await TeamMember.findById(req.params.id);

		if (!teamMember) {
			return res.status(404).json({
				success: false,
				message: "Team member not found",
			});
		}

		// Update fields
		if (name) teamMember.name = name;
		if (mobile) teamMember.mobile = mobile;
		if (position) teamMember.position = position;
		if (order !== undefined) teamMember.order = order;

		// Update image if new one uploaded
		if (req.file) {
			if (teamMember.imagePublicId) {
				try {
					await cloudinary.uploader.destroy(teamMember.imagePublicId);
				} catch (cleanupError) {
					console.error(
						"Error deleting previous team image from Cloudinary:",
						cleanupError
					);
				}
			} else if (teamMember.image) {
				const oldImagePath = path.join(__dirname, "..", teamMember.image);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			teamMember.image = req.file.path;
			teamMember.imagePublicId = req.file.filename;
		}

		await teamMember.save();

		res.json({
			success: true,
			message: "Team member updated successfully",
			data: teamMember,
		});
	} catch (error) {
		console.error("Update team member error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while updating team member",
		});
	}
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
exports.deleteTeamMember = async (req, res) => {
	try {
		const teamMember = await TeamMember.findById(req.params.id);

		if (!teamMember) {
			return res.status(404).json({
				success: false,
				message: "Team member not found",
			});
		}

		// Delete image file
		if (teamMember.imagePublicId) {
			try {
				await cloudinary.uploader.destroy(teamMember.imagePublicId);
			} catch (cleanupError) {
				console.error(
					"Error deleting team member image from Cloudinary:",
					cleanupError
				);
			}
		} else if (teamMember.image) {
			const imagePath = path.join(__dirname, "..", teamMember.image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await TeamMember.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Team member deleted successfully",
		});
	} catch (error) {
		console.error("Delete team member error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting team member",
		});
	}
};
