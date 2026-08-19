const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      whatsapp,
      area,
      price,
      experience,
      availability,
      description,
    } = req.body;

    // Common required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, phone and password.",
      });
    }

    // Provider-specific required fields
    if (role === "provider") {
      if (
        !category ||
        !whatsapp ||
        !area ||
        !price ||
        !experience ||
        !availability ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide all required provider information.",
        });
      }
    }

    // Check existing account
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,

      role: role === "provider" ? "provider" : "user",

      // Provider information
      category: role === "provider" ? category : undefined,
      whatsapp: role === "provider" ? whatsapp : undefined,
      area: role === "provider" ? area : undefined,
      price: role === "provider" ? price : undefined,
      experience: role === "provider" ? experience : undefined,
      availability:
        role === "provider" ? availability : undefined,
      description:
        role === "provider" ? description : undefined,

      // New providers are not automatically verified
      verified: false,
    });

    res.status(201).json({
      success: true,
      message:
        role === "provider"
          ? "Provider account created successfully."
          : "Account created successfully.",

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

// Login User / Provider
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
        role: user.role,
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

// Get Logged-in User / Provider
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

        // Provider information
        category: user.category,
        whatsapp: user.whatsapp,
        area: user.area,
        price: user.price,
        experience: user.experience,
        availability: user.availability,
        description: user.description,
        verified: user.verified,
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