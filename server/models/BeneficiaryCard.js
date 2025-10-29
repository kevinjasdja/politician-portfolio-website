const mongoose = require("mongoose");

const beneficiaryCardSchema = new mongoose.Schema(
	{
		uniqueId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
		},
		fatherName: {
			type: String,
			trim: true,
		},
		wardNo: {
			type: String,
			required: [true, "Ward number is required"],
			trim: true,
		},
		village: {
			type: String,
			required: [true, "Village name is required"],
			trim: true,
		},
		mobile: {
			type: String,
			required: [true, "Mobile number is required"],
			trim: true,
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
		},
		photo: {
			type: String,
			required: [true, "Photo is required"],
		},
		photoPublicId: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

// Generate unique 12-digit ID
beneficiaryCardSchema.pre("save", async function (next) {
	if (!this.uniqueId) {
		// Generate format: 123-456-789-012
		const random = Math.floor(
			100000000000 + Math.random() * 900000000000
		).toString();
		this.uniqueId = `${random.slice(0, 3)}-${random.slice(3, 6)}-${random.slice(
			6,
			9
		)}-${random.slice(9, 12)}`;
	}
	next();
});

module.exports = mongoose.model("BeneficiaryCard", beneficiaryCardSchema);
