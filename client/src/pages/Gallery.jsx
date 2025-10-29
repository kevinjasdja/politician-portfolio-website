import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, ImageIcon, Loader2 } from "lucide-react";
import { galleryAPI } from "../utils/api";
import { updatePageMeta, pageSEO } from "../utils/seo";

const Gallery = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState(null);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	useEffect(() => {
		// Update SEO meta tags for gallery page
		updatePageMeta({
			...pageSEO.gallery,
			canonicalUrl: window.location.origin + "/gallery",
		});

		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const response = await galleryAPI.getAll();
			if (response.data.success) {
				setPosts(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching gallery posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("hi-IN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const openLightbox = (post, imageIndex = 0) => {
		setSelectedPost(post);
		setSelectedImageIndex(imageIndex);
	};

	const closeLightbox = () => {
		setSelectedPost(null);
		setSelectedImageIndex(0);
	};

	const nextImage = () => {
		if (selectedPost && selectedImageIndex < selectedPost.images.length - 1) {
			setSelectedImageIndex(selectedImageIndex + 1);
		}
	};

	const prevImage = () => {
		if (selectedPost && selectedImageIndex > 0) {
			setSelectedImageIndex(selectedImageIndex - 1);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50">
				<Loader2 size={48} className="animate-spin text-orange-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12">
			<div className="section-container">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						<span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
							गैलरी
						</span>
					</h1>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						हमारे गांव की गतिविधियों और कार्यक्रमों की झलकियां
					</p>
				</motion.div>

				{/* Posts Grid */}
				{posts.length === 0 ? (
					<div className="text-center py-20">
						<ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
						<p className="text-gray-500 text-lg">अभी तक कोई पोस्ट नहीं है</p>
					</div>
				) : (
					<div className="space-y-8">
						{posts.map((post, index) => (
							<motion.div
								key={post._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
							>
								{/* Post Header */}
								<div className="p-6 border-b border-gray-100">
									<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
										{post.title}
									</h2>
									<div className="flex items-center text-sm text-gray-500 space-x-4">
										<div className="flex items-center space-x-1">
											<Calendar size={16} />
											<span>{formatDate(post.createdAt)}</span>
										</div>
										{post.facebookLink && (
											<a
												href={post.facebookLink}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
											>
												<ExternalLink size={16} />
												<span>Facebook पर देखें</span>
											</a>
										)}
									</div>
								</div>

								{/* Images Grid */}
								<div
									className={`grid gap-2 p-4 ${
										post.images.length === 1
											? "grid-cols-1"
											: post.images.length === 2
											? "grid-cols-2"
											: post.images.length === 3
											? "grid-cols-3"
											: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
									}`}
								>
									{post.images.map((image, imgIndex) => (
										<div
											key={imgIndex}
											className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
											onClick={() => openLightbox(post, imgIndex)}
										>
											<img
												src={image}
												alt={`${post.title} - Image ${imgIndex + 1}`}
												className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
												<ImageIcon
													size={32}
													className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
												/>
											</div>
										</div>
									))}
								</div>

								{/* Post Description */}
								<div className="p-6">
									<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
										{post.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				)}

				{/* Lightbox Modal */}
				{selectedPost && (
					<div
						className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center p-4"
						onClick={closeLightbox}
					>
						<button
							onClick={closeLightbox}
							className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
						>
							×
						</button>

						<div
							className="relative max-w-5xl w-full"
							onClick={(e) => e.stopPropagation()}
						>
							<img
								src={selectedPost.images[selectedImageIndex]}
								alt={selectedPost.title}
								className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
							/>

							{selectedPost.images.length > 1 && (
								<>
									{selectedImageIndex > 0 && (
										<button
											onClick={prevImage}
											className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
										>
											<svg
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 19l-7-7 7-7"
												/>
											</svg>
										</button>
									)}

									{selectedImageIndex < selectedPost.images.length - 1 && (
										<button
											onClick={nextImage}
											className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
										>
											<svg
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</button>
									)}

									<div className="text-center mt-4 text-white">
										{selectedImageIndex + 1} / {selectedPost.images.length}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Gallery;
