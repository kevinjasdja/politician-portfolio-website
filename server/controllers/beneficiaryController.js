const BeneficiaryCard = require("../models/BeneficiaryCard");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

// @desc    Create beneficiary card
// @route   POST /api/beneficiary
// @access  Public
exports.createBeneficiaryCard = async (req, res) => {
	try {
		const { name, fatherName, wardNo, village, mobile, email } = req.body;

		// Validate required fields
		if (!name || !wardNo || !village || !mobile) {
			return res.status(400).json({
				success: false,
				message:
					"Please provide all required fields (name, ward no, village, mobile)",
			});
		}

		// Check if photo was uploaded
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Please upload a photo",
			});
		}

		// Prevent duplicate registrations for the same mobile number
		const existingCardForMobile = await BeneficiaryCard.findOne({ mobile });

		if (existingCardForMobile) {
			if (req.file?.filename) {
				try {
					await cloudinary.uploader.destroy(req.file.filename);
				} catch (cleanupError) {
					console.error("Error cleaning up duplicate upload:", cleanupError);
				}
			}

			return res.status(409).json({
				success: false,
				message:
					"आपका कार्ड पहले से बना हुआ है। कृपया Verify सेक्शन में नाम और मोबाइल नंबर से डाउनलोड करें।",
				data: existingCardForMobile,
			});
		}

		// Generate unique ID (format: XXX-XXX-XXX-XXX)
		const generateUniqueId = () => {
			const random = Math.floor(
				100000000000 + Math.random() * 900000000000
			).toString();
			return `${random.slice(0, 3)}-${random.slice(3, 6)}-${random.slice(
				6,
				9
			)}-${random.slice(9, 12)}`;
		};

		let uniqueId = generateUniqueId();

		// Check if uniqueId already exists (very rare but possible)
		let existingCard = await BeneficiaryCard.findOne({ uniqueId });
		while (existingCard) {
			uniqueId = generateUniqueId();
			existingCard = await BeneficiaryCard.findOne({ uniqueId });
		}

		// Create beneficiary card
		const beneficiaryCard = await BeneficiaryCard.create({
			uniqueId,
			name,
			fatherName,
			wardNo,
			village,
			mobile,
			email,
			photo: req.file.path,
			photoPublicId: req.file.filename,
		});

		res.status(201).json({
			success: true,
			message: "Beneficiary card created successfully",
			data: beneficiaryCard,
		});
	} catch (error) {
		console.error("Create beneficiary card error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while creating beneficiary card",
		});
	}
};

// @desc    Verify beneficiary card
// @route   POST /api/beneficiary/verify
// @access  Public
exports.verifyBeneficiaryCard = async (req, res) => {
	try {
		let { name, mobile } = req.body;

		// Validate input
		if (!name || !mobile) {
			return res.status(400).json({
				success: false,
				message: "Please provide name and mobile number",
			});
		}

		name = name.trim().replace(/\s+/g, " ");
		mobile = mobile.trim();

		if (!name || !mobile) {
			return res.status(400).json({
				success: false,
				message: "Please provide valid name and mobile number",
			});
		}

		const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const normalizedNamePattern = new RegExp(`^${escapeRegex(name)}$`, "i");

		// Find beneficiary card
		const beneficiaryCard = await BeneficiaryCard.findOne({
			name: { $regex: normalizedNamePattern },
			mobile,
		});

		if (!beneficiaryCard) {
			return res.status(404).json({
				success: false,
				message: "No beneficiary card found with provided details",
			});
		}

		res.json({
			success: true,
			message: "Beneficiary card found",
			data: beneficiaryCard,
		});
	} catch (error) {
		console.error("Verify beneficiary card error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while verifying beneficiary card",
		});
	}
};

// @desc    Get all beneficiary cards
// @route   GET /api/beneficiary
// @access  Private (Admin)
exports.getAllBeneficiaryCards = async (req, res) => {
	try {
		const beneficiaryCards = await BeneficiaryCard.find().sort({
			createdAt: -1,
		});

		res.json({
			success: true,
			count: beneficiaryCards.length,
			data: beneficiaryCards,
		});
	} catch (error) {
		console.error("Get beneficiary cards error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while fetching beneficiary cards",
		});
	}
};

// @desc    Delete beneficiary card
// @route   DELETE /api/beneficiary/:id
// @access  Private (Admin)
exports.deleteBeneficiaryCard = async (req, res) => {
	try {
		const beneficiaryCard = await BeneficiaryCard.findById(req.params.id);

		if (!beneficiaryCard) {
			return res.status(404).json({
				success: false,
				message: "Beneficiary card not found",
			});
		}

		// Delete photo file
		if (beneficiaryCard.photoPublicId) {
			try {
				await cloudinary.uploader.destroy(beneficiaryCard.photoPublicId);
			} catch (cleanupError) {
				console.error(
					"Error deleting beneficiary photo from Cloudinary:",
					cleanupError
				);
			}
		} else if (beneficiaryCard.photo) {
			const photoPath = path.join(__dirname, "..", beneficiaryCard.photo);
			if (fs.existsSync(photoPath)) {
				fs.unlinkSync(photoPath);
			}
		}

		await BeneficiaryCard.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Beneficiary card deleted successfully",
		});
	} catch (error) {
		console.error("Delete beneficiary card error:", error);
		res.status(500).json({
			success: false,
			message: "Server error while deleting beneficiary card",
		});
	}
};
