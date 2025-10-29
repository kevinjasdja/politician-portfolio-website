const mongoose = require("mongoose");

const galleryPostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		facebookLink: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("GalleryPost", galleryPostSchema);
