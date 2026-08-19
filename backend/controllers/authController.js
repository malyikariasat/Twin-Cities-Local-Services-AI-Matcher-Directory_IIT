const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Provider = require("../models/Provider");

// Register User / Provider
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      category,
      area,
      whatsapp,
      experience,
      price,
      availability,
      description,
    } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email, phone and password.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === "provider" ? "provider" : "user";

    // Create User account
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: userRole,

      category:
        userRole === "provider"
          ? category
          : "",

      area:
        userRole === "provider"
          ? area
          : "",

      whatsapp:
        userRole === "provider"
          ? whatsapp || phone
          : "",

      experience:
        userRole === "provider"
          ? experience || "1 Year"
          : "1 Year",

      price:
        userRole === "provider"
          ? Number(price) || 0
          : 0,

      availability:
        userRole === "provider"
          ? availability || "Available Today"
          : "Available Today",

      description:
        userRole === "provider"
          ? description || ""
          : "",
    });

    // -----------------------------------------
    // CREATE PROVIDER RECORD
    // -----------------------------------------

    if (userRole === "provider") {
      const provider = await Provider.create({
        name: user.name,
        category: category,
        area: area,
        phone: user.phone,
        whatsapp: whatsapp || user.phone,
        experience: experience || "1 Year",
        rating: 0,
        reviews: 0,
        price: Number(price) || 0,
        availability:
          availability || "Available Today",
        verified: false,
        responseTime: "30 mins",
        description:
          description ||
          "Service provider registered on Twin Cities AI.",
      });

      return res.status(201).json({
        success: true,
        message: "Provider account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        provider: {
          id: provider._id,
          name: provider.name,
          category: provider.category,
          area: provider.area,
        },
      });
    }

    // -----------------------------------------
    // NORMAL USER RESPONSE
    // -----------------------------------------

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating account.",
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
};


// Get Logged-in User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
};