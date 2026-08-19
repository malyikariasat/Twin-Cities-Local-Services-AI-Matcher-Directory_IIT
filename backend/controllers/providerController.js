const Provider = require("../models/Provider");
const User = require("../models/User");

// Get All Providers with Search & Filters
const getProviders = async (req, res) => {
  try {
    const { search, category, area, rating } = req.query;

    let providerFilter = {};
    let userFilter = {
      role: "provider",
    };

    // -----------------------------
    // SEARCH
    // -----------------------------
    if (search) {
      const searchRegex = {
        $regex: search,
        $options: "i",
      };

      providerFilter.$or = [
        { name: searchRegex },
        { category: searchRegex },
      ];

      userFilter.$or = [
        { name: searchRegex },
        { category: searchRegex },
      ];
    }

    // -----------------------------
    // CATEGORY
    // -----------------------------
    if (category) {
      providerFilter.category = category;
      userFilter.category = category;
    }

    // -----------------------------
    // AREA
    // -----------------------------
    if (area) {
      providerFilter.area = area;
      userFilter.area = area;
    }

    // -----------------------------
    // RATING
    // -----------------------------
    if (rating) {
      providerFilter.rating = {
        $gte: Number(rating),
      };

      // New providers have no rating yet
      // so they will not appear when a rating
      // filter is specifically selected.
    }

    // -----------------------------
    // GET EXISTING DUMMY PROVIDERS
    // -----------------------------
    const existingProviders = await Provider.find(
      providerFilter
    ).lean();

    // -----------------------------
    // GET REGISTERED PROVIDERS
    // -----------------------------
    let registeredProviders = [];

    // Only fetch registered providers if
    // there is no rating filter.
    if (!rating) {
      registeredProviders = await User.find(userFilter)
        .select("-password")
        .lean();
    }

    // -----------------------------
    // CONVERT USER PROVIDERS
    // INTO PROVIDER FORMAT
    // -----------------------------
    const formattedRegisteredProviders =
      registeredProviders.map((user) => ({
        _id: user._id,

        name: user.name,

        category: user.category,

        area: user.area,

        phone: user.phone,

        whatsapp: user.whatsapp || user.phone,

        experience: user.experience || "1 Year",

        rating: 0,

        reviews: 0,

        price: Number(
          String(user.price || "0").replace(/[^0-9.]/g, "")
        ),

        availability:
          user.availability || "Available Today",

        verified: user.verified || false,

        responseTime: "30 mins",

        description:
          user.description ||
          "Service provider registered on Twin Cities AI.",

        isRegisteredProvider: true,
      }));

    // -----------------------------
    // COMBINE BOTH
    // -----------------------------
    const allProviders = [
      ...existingProviders,
      ...formattedRegisteredProviders,
    ];

    res.status(200).json(allProviders);

  } catch (error) {
    console.error("Get Providers Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Single Provider
const getProviderById = async (req, res) => {
  try {

    // First check existing Provider collection
    const provider = await Provider.findById(
      req.params.id
    ).lean();

    if (provider) {
      return res.status(200).json(provider);
    }

    // If not found, check registered providers
    const userProvider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    })
      .select("-password")
      .lean();

    if (!userProvider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const formattedProvider = {
      _id: userProvider._id,

      name: userProvider.name,

      category: userProvider.category,

      area: userProvider.area,

      phone: userProvider.phone,

      whatsapp:
        userProvider.whatsapp ||
        userProvider.phone,

      experience:
        userProvider.experience ||
        "1 Year",

      rating: 0,

      reviews: 0,

      price: Number(
        String(userProvider.price || "0")
          .replace(/[^0-9.]/g, "")
      ),

      availability:
        userProvider.availability ||
        "Available Today",

      verified:
        userProvider.verified || false,

      responseTime: "30 mins",

      description:
        userProvider.description ||
        "Service provider registered on Twin Cities AI.",

      isRegisteredProvider: true,
    };

    res.status(200).json(formattedProvider);

  } catch (error) {
    console.error(
      "Get Provider Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getProviders,
  getProviderById,
};