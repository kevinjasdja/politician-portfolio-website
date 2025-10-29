import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import PromiseCard from "../components/PromiseCard";
import { promises } from "../utils/constants";
import { heroAPI } from "../utils/api";
import { getServerURL } from "../utils/constants";
import { updatePageMeta, pageSEO } from "../utils/seo";

const Home = () => {
	const [heroContent, setHeroContent] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Update SEO meta tags for home page
		updatePageMeta({
			...pageSEO.home,
			canonicalUrl: window.location.origin + "/",
		});

		fetchHeroContent();
	}, []);

	const fetchHeroContent = async () => {
		try {
			const response = await heroAPI.get();
			if (response.data.success) {
				setHeroContent(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching hero content:", error);
		} finally {
			setLoading(false);
		}
	};

	const heroImageUrl = heroContent?.heroImage
		? heroContent.heroImage.startsWith("http")
			? heroContent.heroImage
			: `${getServerURL()}${heroContent.heroImage}`
		: null;
	const hasHeroImage = Boolean(heroImageUrl);

	return (
		<div className="min-h-screen overflow-x-hidden bg-gray-50">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-green-500 text-white overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
						}}
					/>
				</div>

				<div className="relative section-container py-16 sm:py-20 lg:py-24 xl:py-28">
					<div
						className={`grid grid-cols-1 gap-10 lg:gap-16 xl:gap-20 items-center ${
							hasHeroImage ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
						}`}
					>
						{/* Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className={`z-10 space-y-6 lg:space-y-7 xl:space-y-8 ${
								hasHeroImage
									? "text-center lg:text-left"
									: "text-center lg:text-center mx-auto lg:max-w-3xl"
							}`}
						>
							<div className="inline-block bg-white/25 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg">
								<span className="text-sm sm:text-base lg:text-lg font-bold text-white drop-shadow-md">
									🗳️ मुखिया प्रत्याशी 2025
								</span>
							</div>

							<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white drop-shadow-lg text-balance">
								{heroContent?.title || "अभिषेक सर्राफ – मुखिया प्रत्याशी"}
							</h1>

							<p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-md text-balance">
								{heroContent?.subtitle || "ग्राम पंचायत राज सोमगढ़"}
							</p>

							<p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white font-semibold italic leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md bg-black/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl">
								{heroContent?.description ||
									'"विकास की नई पहचान – ईमानदार नेतृत्व, जनसेवा हमारा धर्म"'}
							</p>

							<div
								className={`flex flex-col sm:flex-row gap-4 sm:gap-5 pt-6 ${
									hasHeroImage
										? "justify-center lg:justify-start"
										: "justify-center"
								}`}
							>
								<Link
									to="/beneficiary"
									className="bg-white text-orange-600 px-7 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 lg:space-x-3"
								>
									<span>Get Your Card</span>
									<ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
								</Link>
								<Link
									to="/contact"
									className="bg-green-600 hover:bg-green-700 text-white px-7 sm:px-10 lg:px-12 py-3.5 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 lg:space-x-3"
								>
									<MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
									<span>संपर्क करें</span>
								</Link>
							</div>
						</motion.div>

						{/* Hero Image */}
						{heroImageUrl && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.8 }}
								className="relative mt-10 lg:mt-0 order-first lg:order-last"
							>
								<div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-lg mx-auto lg:max-w-none">
									<img
										src={heroImageUrl}
										alt="Abhishek Sarraf"
										className="w-full h-auto object-cover"
										onError={(e) => {
											e.target.style.display = "none";
										}}
									/>
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
								</div>
							</motion.div>
						)}
					</div>
				</div>

				{/* Wave Divider */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg
						viewBox="0 0 1440 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-auto"
					>
						<path
							d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
							fill="white"
						/>
					</svg>
				</div>
			</section>

			{/* Promises Section */}
			<section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gray-50">
				<div className="section-container">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12 sm:mb-16 lg:mb-20"
					>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 sm:mb-5 lg:mb-6">
							हमारे प्रमुख संकल्प
						</h2>
						<p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
							आने वाले 1-2 वर्षों में 15+ विकास कार्य पूरे करने का वादा
						</p>
						<div className="mt-5 sm:mt-6 lg:mt-8 h-1.5 w-24 sm:w-32 lg:w-40 bg-gradient-to-r from-orange-500 to-green-500 mx-auto rounded-full" />
					</motion.div>

					{/* Promises Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12">
						{promises.map((promise, index) => (
							<PromiseCard key={promise.id} promise={promise} index={index} />
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-orange-600 to-green-600 text-white">
				<div className="section-container max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="space-y-6 lg:space-y-8"
					>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold px-4 leading-tight">
							आपका विश्वास और सहयोग ही हमारी ताकत है
						</h2>
						<p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/95 px-4 max-w-3xl mx-auto leading-relaxed text-balance">
							हम सबके सामूहिक प्रयास से इस पंचायत को उज्ज्वल, समृद्ध और
							आत्मनिर्भर बनाएंगे।
						</p>
						<Link
							to="/contact"
							className="inline-flex items-center space-x-3 bg-white text-orange-600 px-8 sm:px-10 lg:px-14 py-4 sm:py-5 lg:py-6 rounded-full text-base sm:text-lg lg:text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
						>
							<MessageCircle className="w-5 h-5 lg:w-7 lg:h-7" />
							<span>Join Our Mission</span>
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Floating Contact Button */}
			<Link
				to="/contact"
				className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-5 lg:p-6 rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 z-40 group"
				aria-label="Contact Us"
			>
				<MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:animate-pulse" />
			</Link>
		</div>
	);
};

export default Home;
