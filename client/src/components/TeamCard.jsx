import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { getServerURL } from "../utils/constants";

const TeamCard = ({ member, index }) => {
  const imageUrl = member.image?.startsWith("http")
    ? member.image
    : `${getServerURL()}${member.image}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300"
    >
      {/* Image Container - Round Image */}
      <div className="relative pt-6 pb-4 px-6 bg-gradient-to-br from-orange-50 to-green-50 flex justify-center items-center">
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img
            src={imageUrl}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ccircle fill="%23ddd" cx="100" cy="100" r="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="40" dy=".3em" text-anchor="middle" x="100" y="100"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Position Badge */}
        {member.position && (
          <div className="inline-block bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {member.position}
          </div>
        )}

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          {member.name}
        </h3>

        {/* Mobile Number */}
        <div className="flex items-center space-x-2 text-gray-700">
          <Phone size={18} className="text-orange-600 flex-shrink-0" />
          <a
            href={`tel:${member.mobile}`}
            className="font-semibold hover:text-orange-600 transition-colors"
          >
            {member.mobile}
          </a>
        </div>

        {/* Decorative Line */}
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-green-500" />
      </div>
    </motion.div>
  );
};

export default TeamCard;
