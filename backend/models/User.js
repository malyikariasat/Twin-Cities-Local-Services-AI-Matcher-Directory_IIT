const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "provider"],
      default: "user",
    },

    // Provider-specific fields
    category: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "1 Year",
    },

    price: {
      type: Number,
      default: 0,
    },

    availability: {
      type: String,
      default: "Available Today",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);