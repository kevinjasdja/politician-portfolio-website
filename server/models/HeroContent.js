const mongoose = require("mongoose");

const heroContentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			default: "अभिषेक सर्राफ – मुखिया प्रत्याशी, ग्राम पंचायत राज सोमगढ़",
		},
		subtitle: {
			type: String,
			default: "विकास की नई पहचान – ईमानदार नेतृत्व, जनसेवा हमारा धर्म",
		},
		heroImage: {
			type: String,
			default: "",
		},
		heroImagePublicId: {
			type: String,
			default: "",
		},
		description: {
			type: String,
			default:
				"आप सभी के प्यार और आशीर्वाद से हम इस पंचायत के सर्वांगीण विकास के लिए दृढ़ संकल्पित हैं।",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("HeroContent", heroContentSchema);
