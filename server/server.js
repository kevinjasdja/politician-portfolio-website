require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const teamRoutes = require("./routes/teamRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const heroRoutes = require("./routes/heroRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// CORS configuration
const allowedOrigins = [
	"https://abhisheksarraf.in",
	"https://www.abhisheksarraf.in",
	"https://sarrafabhishek.vercel.app",
	"http://localhost:5173",
	"http://localhost:5000",
];

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
app.use("/api/uploads", express.static(uploadsPath));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/beneficiary", beneficiaryRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/gallery", galleryRoutes);

// Health check route
app.get("/api/health", (req, res) => {
	res.json({
		success: true,
		message: "Server is running",
		timestamp: new Date().toISOString(),
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Server Error:", err);

	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal server error",
	});
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`\n🚀 Server running on port ${PORT}`);
	console.log(`🌐 API URL: http://localhost:${PORT}`);
	console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Promise Rejection:", err);
	// Close server & exit process
	process.exit(1);
});
