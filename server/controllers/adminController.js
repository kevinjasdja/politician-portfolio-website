const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: {
          id: req.admin._id,
          email: req.admin.email,
          name: req.admin.name,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Initialize admin (first time setup)
// @route   POST /api/admin/init
// @access  Public (should be protected in production)
exports.initAdmin = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file.",
      });
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email: adminEmail });

    if (admin) {
      // Admin exists, update password
      admin.password = adminPassword;
      await admin.save();
      res.status(200).json({
        success: true,
        message: "Admin password updated successfully.",
        data: { id: admin._id, email: admin.email },
      });
    } else {
      // Admin does not exist, create new one
      admin = await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: "Initial Admin",
      });
      res.status(201).json({
        success: true,
        message: "Admin initialized successfully",
        data: { id: admin._id, email: admin.email },
      });
    }
  } catch (error) {
    console.error("Init admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin initialization",
    });
  }
};
