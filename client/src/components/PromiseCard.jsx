import { motion } from "framer-motion";

const PromiseCard = ({ promise, index }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			whileHover={{ y: -6, scale: 1.02 }}
			className="group relative card-surface overflow-hidden hover:shadow-2xl transition-all duration-300 h-full"
		>
			{/* Gradient Overlay on Hover */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${promise.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
			/>

			<div className="card-padding relative z-10 flex flex-col h-full gap-4 sm:gap-5">
				{/* Promise Number */}
				<div className="inline-block bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full">
					संकल्प #{promise.id}
				</div>

				{/* Title */}
				<h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-snug text-balance">
					{promise.title}
				</h3>

				{/* Description */}
				<p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
					{promise.description}
				</p>

				{/* English Title */}
				<p className="text-sm font-semibold text-orange-600">
					{promise.englishTitle}
				</p>

				{/* English Description */}
				<p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
					{promise.englishDesc}
				</p>

				{/* Decorative Bottom Line */}
				<div
					className={`mt-4 sm:mt-6 h-1 w-24 sm:w-28 rounded-full bg-gradient-to-r ${promise.color} group-hover:w-full transition-all duration-500`}
				/>
			</div>
		</motion.div>
	);
};

export default PromiseCard;
