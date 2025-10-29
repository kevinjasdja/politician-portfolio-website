import {
	Phone,
	Mail,
	MapPin,
	Facebook,
	Instagram,
	MessageCircle,
	ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 text-white">
			<div className="section-container py-10 sm:py-12 lg:py-14">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{/* About Section */}
					<div className="text-center sm:text-left">
						<h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
							अभिषेक सर्राफ
						</h3>
						<p className="text-orange-100 mb-3 sm:mb-4 text-sm sm:text-base">
							मुखिया प्रत्याशी
							<br />
							ग्राम पंचायत राज सोमगढ़
						</p>
						<p className="text-xs sm:text-sm text-orange-50 italic leading-relaxed">
							"विकास की नई पहचान – ईमानदार नेतृत्व, जनसेवा हमारा धर्म"
						</p>
					</div>

					{/* Quick Links */}
					<div className="text-center sm:text-left">
						<h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
							त्वरित लिंक
						</h3>
						<ul className="space-y-2 text-orange-100 text-sm sm:text-base">
							<li>
								<a
									href="/"
									className="hover:text-white transition-colors inline-block"
								>
									होम
								</a>
							</li>
							<li>
								<a
									href="/team"
									className="hover:text-white transition-colors inline-block"
								>
									टीम
								</a>
							</li>
							<li>
								<a
									href="/beneficiary"
									className="hover:text-white transition-colors inline-block"
								>
									बेनिफिशियरी कार्ड
								</a>
							</li>
							<li>
								<a
									href="/gallery"
									className="hover:text-white transition-colors inline-block"
								>
									गैलरी
								</a>
							</li>
							<li>
								<a
									href="/contact"
									className="hover:text-white transition-colors inline-block"
								>
									संपर्क करें
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="text-center sm:text-left">
						<h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
							संपर्क जानकारी
						</h3>
						<div className="space-y-3 text-orange-100 text-sm sm:text-base">
							<div className="flex items-start space-x-2 sm:space-x-3 justify-center sm:justify-start">
								<Phone
									size={18}
									className="sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0"
								/>
								<div>
									<p className="font-semibold">+91-9572740290</p>
								</div>
							</div>
							<div className="flex items-start space-x-2 sm:space-x-3 justify-center sm:justify-start">
								<MapPin
									size={18}
									className="sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0"
								/>
								<div>
									<p>ग्राम पंचायत राज सोमगढ़</p>
									<p>बिहार</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Social Media & Gallery Icons */}
				<div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-orange-400">
					<div className="flex justify-center items-center space-x-6 sm:space-x-8">
						{/* Facebook */}
						<a
							href="https://www.facebook.com/samajasevi.abhiseka.sararpha"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-col items-center space-y-1 sm:space-y-2"
							aria-label="Facebook"
						>
							<div className="bg-white/20 hover:bg-white/30 p-3 sm:p-4 rounded-full transition-all duration-300 group-hover:scale-110">
								<Facebook size={20} className="sm:w-6 sm:h-6" />
							</div>
							<span className="text-xs sm:text-sm text-orange-100">
								Facebook
							</span>
						</a>

						{/* Instagram */}
						<a
							href="https://www.instagram.com/abhi_shekshroff"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-col items-center space-y-1 sm:space-y-2"
							aria-label="Instagram"
						>
							<div className="bg-white/20 hover:bg-white/30 p-3 sm:p-4 rounded-full transition-all duration-300 group-hover:scale-110">
								<Instagram size={20} className="sm:w-6 sm:h-6" />
							</div>
							<span className="text-xs sm:text-sm text-orange-100">
								Instagram
							</span>
						</a>

						{/* WhatsApp */}
						<a
							href="https://wa.me/919572740290?text=Hi"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-col items-center space-y-1 sm:space-y-2"
							aria-label="WhatsApp"
						>
							<div className="bg-white/20 hover:bg-white/30 p-3 sm:p-4 rounded-full transition-all duration-300 group-hover:scale-110">
								<MessageCircle size={20} className="sm:w-6 sm:h-6" />
							</div>
							<span className="text-xs sm:text-sm text-orange-100">
								WhatsApp
							</span>
						</a>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-orange-400">
					<div className="text-center text-orange-100">
						<p className="text-xs sm:text-sm md:text-base">
							© {currentYear} अभिषेक सर्राफ - सर्वाधिकार सुरक्षित
						</p>
						<p className="text-xs sm:text-sm mt-2 text-orange-50">
							Vote for Vikas – Hamara Sapna, Bihar ka No.1 Panchayat ho Apna
						</p>
						<p className="text-xs sm:text-sm mt-3 text-orange-50">
							Powered by{" "}
							<a
								href="https://www.kalawatiputra.com"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold hover:text-white transition-colors underline"
							>
								kalawatiputra.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
