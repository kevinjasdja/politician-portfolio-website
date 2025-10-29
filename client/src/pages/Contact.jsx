import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { contactAPI } from "../utils/api";
import { updatePageMeta, pageSEO } from "../utils/seo";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		mobile: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		// Update SEO meta tags for contact page
		updatePageMeta({
			...pageSEO.contact,
			canonicalUrl: window.location.origin + "/contact",
		});
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await contactAPI.create(formData);
			if (response.data.success) {
				setSuccess(true);
				setFormData({ name: "", email: "", mobile: "", message: "" });
				setTimeout(() => setSuccess(false), 5000);
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Failed to submit. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-12 sm:py-16 lg:py-20">
				<div className="section-container text-center">
					<motion.div
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-4 sm:space-y-5"
					>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold px-4">
							हमसे संपर्क करें
						</h1>
						<p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/95 max-w-2xl mx-auto px-4">
							आपके सुझाव और सहयोग हमारे लिए महत्वपूर्ण हैं
						</p>
						<div className="mt-5 sm:mt-7 h-1 w-24 sm:w-32 bg-white mx-auto rounded-full" />
					</motion.div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="flex-1 py-12 sm:py-16 lg:py-20">
				<div className="section-container">
					<div className="mx-auto max-w-3xl">
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="card-surface card-padding"
						>
							<h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
								Send Us a Message
							</h3>

							{success && (
								<div className="mb-6 sm:mb-8 bg-green-50 border-l-4 border-green-500 p-4 sm:p-5 rounded-lg">
									<div className="flex items-center">
										<CheckCircle
											className="text-green-500 mr-3 sm:mr-4 flex-shrink-0"
											size={24}
										/>
										<div>
											<p className="font-bold text-green-800 text-base sm:text-lg">
												Thank you for contacting us!
											</p>
											<p className="text-sm sm:text-base text-green-700">
												We will get back to you soon.
											</p>
										</div>
									</div>
								</div>
							)}

							{error && (
								<div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
									<p className="text-red-800 text-sm sm:text-base">{error}</p>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
								{/* Name */}
								<div>
									<label
										htmlFor="name"
										className="block text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2 sm:mb-3"
									>
										Name / नाम <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
										placeholder="Enter your full name"
									/>
								</div>

								{/* Email */}
								<div>
									<label
										htmlFor="email"
										className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
									>
										Email <span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
										placeholder="your.email@example.com"
									/>
								</div>

								{/* Mobile */}
								<div>
									<label
										htmlFor="mobile"
										className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
									>
										Mobile Number / मोबाइल नंबर{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type="tel"
										id="mobile"
										name="mobile"
										value={formData.mobile}
										onChange={handleChange}
										required
										pattern="[0-9]{10}"
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
										placeholder="10-digit mobile number"
									/>
								</div>

								{/* Message */}
								<div>
									<label
										htmlFor="message"
										className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
									>
										Message / संदेश <span className="text-red-500">*</span>
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows="5"
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
										placeholder="Write your message here..."
									/>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 sm:py-4 rounded-lg text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
								>
									{loading ? (
										<>
											<Loader2 className="animate-spin" size={18} />
											<span>Submitting...</span>
										</>
									) : (
										<>
											<Mail size={18} className="sm:w-5 sm:h-5" />
											<span>Submit Message</span>
										</>
									)}
								</button>
							</form>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Contact;
