import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
	Menu,
	X,
	Home,
	Users,
	CreditCard,
	Mail,
	Shield,
	ImageIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const { isAuthenticated } = useAuth();

	const navLinks = [
		{ path: "/", label: "होम", icon: Home },
		{ path: "/team", label: "टीम", icon: Users },
		{ path: "/beneficiary", label: "बेनिफिशियरी कार्ड", icon: CreditCard },
		{ path: "/gallery", label: "गैलरी", icon: ImageIcon },
		{ path: "/contact", label: "संपर्क", icon: Mail },
	];

	if (isAuthenticated) {
		navLinks.push({ path: "/admin", label: "एडमिन", icon: Shield });
	}

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-lg z-[1000] backdrop-blur supports-[backdrop-filter]:bg-white/80">
			<div className="section-container">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<div className="text-2xl font-bold text-orange-600">
							अभिषेक सर्राफ{" "}
						</div>
						<div className="hidden sm:block text-sm text-gray-700 font-semibold">
							ग्राम पंचायत राज सोमगढ़
						</div>
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-6">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={link.path}
									className={`px-3 py-2 rounded-lg text-sm lg:text-base font-semibold transition-all duration-300 flex items-center space-x-2 ${
										isActive(link.path)
											? "bg-orange-600 text-white shadow-md"
											: "text-gray-700 hover:bg-orange-100/80 hover:text-orange-700"
									}`}
								>
									<Icon size={18} />
									<span className="whitespace-nowrap text-sm lg:text-base">
										{link.label}
									</span>
								</Link>
							);
						})}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-100 transition-colors"
						aria-label="Toggle menu"
					>
						{isOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden pb-3 space-y-2">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={link.path}
									onClick={() => setIsOpen(false)}
									className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-3 ${
										isActive(link.path)
											? "bg-orange-600 text-white shadow-md"
											: "text-gray-700 hover:bg-orange-100/80 hover:text-orange-700"
									}`}
								>
									<Icon size={18} />
									<span>{link.label}</span>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
