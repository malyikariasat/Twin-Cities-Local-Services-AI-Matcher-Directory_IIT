const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      default: "1 Year",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    availability: {
      type: String,
      default: "Available Today",
    },

    verified: {
      type: Boolean,
      default: true,
    },

    responseTime: {
      type: String,
      default: "30 mins",
    },

    description: {
   
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);