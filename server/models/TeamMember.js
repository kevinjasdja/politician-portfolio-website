const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		mobile: {
			type: String,
			required: [true, "Mobile number is required"],
			trim: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		imagePublicId: {
			type: String,
			default: "",
		},
		position: {
			type: String,
			default: "Team Member",
			trim: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
