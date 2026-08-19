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

    // Provider information
    category: {
      type: String,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    price: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    availability: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);