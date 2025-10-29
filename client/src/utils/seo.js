// SEO utility functions for dynamic meta tag updates

export const updatePageMeta = ({
	title,
	description,
	keywords,
	ogTitle,
	ogDescription,
	ogImage,
	canonicalUrl,
}) => {
	// Update title
	if (title) {
		document.title = title;
	}

	// Update or create meta tags
	const updateMetaTag = (selector, content) => {
		if (!content) return;
		let element = document.querySelector(selector);
		if (element) {
			element.setAttribute("content", content);
		} else {
			const meta = document.createElement("meta");
			const parts = selector.replace(/[\[\]]/g, "").split("=");
			meta.setAttribute(parts[0], parts[1].replace(/['"]/g, ""));
			meta.setAttribute("content", content);
			document.head.appendChild(meta);
		}
	};

	// Update standard meta tags
	if (description) {
		updateMetaTag('meta[name="description"]', description);
	}
	if (keywords) {
		updateMetaTag('meta[name="keywords"]', keywords);
	}

	// Update Open Graph tags
	if (ogTitle || title) {
		updateMetaTag('meta[property="og:title"]', ogTitle || title);
	}
	if (ogDescription || description) {
		updateMetaTag(
			'meta[property="og:description"]',
			ogDescription || description
		);
	}
	if (ogImage) {
		updateMetaTag('meta[property="og:image"]', ogImage);
	}

	// Update Twitter tags
	if (ogTitle || title) {
		updateMetaTag('meta[property="twitter:title"]', ogTitle || title);
	}
	if (ogDescription || description) {
		updateMetaTag(
			'meta[property="twitter:description"]',
			ogDescription || description
		);
	}
	if (ogImage) {
		updateMetaTag('meta[property="twitter:image"]', ogImage);
	}

	// Update canonical URL
	if (canonicalUrl) {
		let canonical = document.querySelector('link[rel="canonical"]');
		if (canonical) {
			canonical.setAttribute("href", canonicalUrl);
		} else {
			canonical = document.createElement("link");
			canonical.setAttribute("rel", "canonical");
			canonical.setAttribute("href", canonicalUrl);
			document.head.appendChild(canonical);
		}
	}
};

// Page-specific SEO configurations
export const pageSEO = {
	home: {
		title:
			"अभिषेक सर्राफ - मुखिया प्रत्याशी | ग्राम पंचायत सोमगढ़ | Abhishek Sarraf",
		description:
			"अभिषेक सर्राफ - मुखिया प्रत्याशी ग्राम पंचायत सोमगढ़, बिहार। समाजसेवी, विकासशील नेतृत्व। 15+ सरकारी योजनाओं का लाभ। Vote for Vikas - Hamara Sapna, Bihar ka No.1 Panchayat ho Apna.",
		keywords:
			"अभिषेक सर्राफ, Abhishek Sarraf, समाजसेवी अभिषेक सर्राफ, मुखिया अभिषेक, अभिषेक सोमगढ़, मुखिया प्रत्याशी, ग्राम पंचायत सोमगढ़, बिहार पंचायत चुनाव, Vote for Vikas",
	},
	team: {
		title:
			"टीम - अभिषेक सर्राफ | Team Members | ग्राम पंचायत सोमगढ़ | Abhishek Sarraf Team",
		description:
			"अभिषेक सर्राफ की टीम - ग्राम पंचायत सोमगढ़ के समर्पित सदस्य। हमारी टीम ग्रामीण विकास और समाज सेवा के लिए प्रतिबद्ध है। Team of Abhishek Sarraf Somgarh.",
		keywords:
			"अभिषेक सर्राफ टीम, Abhishek Sarraf Team, सोमगढ़ टीम, पंचायत टीम, ग्राम विकास टीम, Somgarh Team Members",
	},
	beneficiary: {
		title:
			"बेनिफिशियरी कार्ड - 15+ योजनाओं का लाभ | Beneficiary Card | अभिषेक सर्राफ सोमगढ़",
		description:
			"अपना बेनिफिशियरी कार्ड बनाएं और 15+ सरकारी योजनाओं का प्रमाणपत्र पाएं। PM Kisan, आवास योजना, शौचालय योजना, और अधिक। Abhishek Sarraf Beneficiary Card Somgarh Bihar.",
		keywords:
			"बेनिफिशियरी कार्ड, Beneficiary Card, सरकारी योजना, PM Kisan, आवास योजना, शौचालय योजना, मुद्रा लोन, अभिषेक सर्राफ बेनिफिशियरी, Government Schemes Bihar",
	},
	gallery: {
		title:
			"गैलरी - फोटो और कार्यक्रम | Gallery | अभिषेक सर्राफ सोमगढ़ की गतिविधियां",
		description:
			"ग्राम पंचायत सोमगढ़ की गतिविधियों और कार्यक्रमों की तस्वीरें। समाजसेवी अभिषेक सर्राफ द्वारा आयोजित कार्यक्रम। Gallery of Abhishek Sarraf Somgarh activities and events.",
		keywords:
			"अभिषेक सर्राफ गैलरी, सोमगढ़ गैलरी, ग्राम पंचायत फोटो, कार्यक्रम फोटो, Abhishek Sarraf Gallery, Somgarh Events",
	},
	contact: {
		title:
			"संपर्क करें - अभिषेक सर्राफ | Contact | ग्राम पंचायत सोमगढ़ | Get in Touch",
		description:
			"अभिषेक सर्राफ से संपर्क करें। ग्राम पंचायत सोमगढ़, बिहार। फोन: +91-9572740290। Contact Abhishek Sarraf Mukhiya Pratyashi for any queries or support.",
		keywords:
			"अभिषेक सर्राफ संपर्क, Contact Abhishek Sarraf, सोमगढ़ संपर्क, मुखिया से संपर्क, Somgarh Contact Number",
	},
};

// Add structured data dynamically
export const addStructuredData = (type, data) => {
	const script = document.createElement("script");
	script.type = "application/ld+json";
	script.text = JSON.stringify(data);
	script.id = `structured-data-${type}`;

	// Remove existing structured data of same type
	const existing = document.getElementById(`structured-data-${type}`);
	if (existing) {
		existing.remove();
	}

	document.head.appendChild(script);
};
