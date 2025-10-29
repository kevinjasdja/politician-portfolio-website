const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, baseFolder } = require("../config/cloudinary");

const resolveFolder = (req) => {
	const baseUrl = req.baseUrl || "";

	if (baseUrl.includes("beneficiary")) {
		return `${baseFolder}/beneficiaries`;
	}

	if (baseUrl.includes("team")) {
		return `${baseFolder}/team`;
	}

	if (baseUrl.includes("hero")) {
		return `${baseFolder}/hero`;
	}

	if (baseUrl.includes("gallery")) {
		return `${baseFolder}/gallery`;
	}

	return `${baseFolder}/misc`;
};

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		const folder = resolveFolder(req);
		const extension = path
			.extname(file.originalname)
			.replace(".", "")
			.toLowerCase();
		const publicId = `${file.fieldname}-${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}`;

		return {
			folder,
			public_id: publicId,
			resource_type: "image",
			allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
			format: extension || undefined,
		};
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	}

	cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
};

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter,
});

module.exports = upload;
