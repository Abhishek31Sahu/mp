import listing from "../models/landInfo.js";
import User from "../models/user.js";
import LandProperty from "../models/landProperty.js";
export const showProperty = async (req, res) => {
  try {
    // Step 1: Get user info
    const userData = await User.findById(req.params.id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const aadhaarNumber = userData.aadhaarNumber;

    // Step 2: Fetch property data from Mongo (instead of blockchain API)
    console.log("andsngj");
    const propertyList = await LandProperty.find();
    console.log(propertyList);
    if (!propertyList || propertyList.length === 0) {
      return res.status(200).json({
        success: true,
        aadhaarNumber,
        data: [],
        message: "No properties found for this Aadhaar number",
      });
    }
    console.log(propertyList);
    // Step 3: Return property data
    res.status(200).json({
      success: true,
      aadhaarNumber,
      count: propertyList.length,
      data: propertyList,
      message: "Properties fetched successfully from registry",
    });
  } catch (error) {
    console.error("Error in showProperty:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching property data",
    });
  }
};

export const applySale = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const logoPath = req.file?.path;
  console.log(logoPath);
  const info = {
    title: data.title,
    description: data.description,
    price: data.price,
    image: {
      filename: data.imageName || "default.jpg", // optional: get the filename if available
      url: logoPath, // Cloudinary URL
    },
    owner: req.user._id,
    landId: data.landId,
  };
  const land = new listing(info);
  await land.save();
  res.status(200).json({
    success: true,
    message: "Property successfully available for sale",
  });
};

export const availableForSale = async (req, res) => {
  try {
    // Step 1: Fetch all available properties from Mongo
    const properties = await Property.find();

    // Step 2: For each property, get blockchain info
    const enrichedProperties = await Promise.all(
      properties.map(async (land) => {
        try {
          // Blockchain API call using landId
          const response = await LandProperty.find({ landId: land.landId });

          const blockchainData = response || {};

          // Merge both data sources
          return {
            ...land.toObject(),
            blockchain: blockchainData,
          };
        } catch (err) {
          console.error(
            `Blockchain fetch failed for ${land.landId}:`,
            err.message
          );
          return {
            ...land.toObject(),
            blockchain: null, // or some fallback
          };
        }
      })
    );

    // Step 3: Send response
    res.status(200).json({
      success: true,
      message: "Properties available for sale",
      data: enrichedProperties,
    });
  } catch (error) {
    console.error("Error fetching available properties:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching properties",
    });
  }
};

export const userAvailablePropertyForSale = async (req, res) => {
  try {
    // Fetch all properties owned by this user
    const properties = await Property.find({
      owner: req.user._id,
      status: "available", // optional filter
    }).populate("owner", "name email aadhaarNumber");

    // If no properties found
    if (!properties || properties.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No properties available for sale",
      });
    }
    const enrichedProperties = await Promise.all(
      properties.map(async (land) => {
        try {
          // Blockchain API call using landId
          const response = await LandProperty.find({ landId: land.landId });

          const blockchainData = response || {};

          // Merge both data sources
          return {
            ...land.toObject(),
            blockchain: blockchainData,
          };
        } catch (err) {
          console.error(
            `Blockchain fetch failed for ${land.landId}:`,
            err.message
          );
          return {
            ...land.toObject(),
            blockchain: null, // or some fallback
          };
        }
      })
    );
    // Success
    res.status(200).json({
      success: true,
      count: enrichedProperties.length,
      data: enrichedProperties,
      message: "User's available properties fetched successfully",
    });
  } catch (error) {
    console.error("Error in userAvailablePropertyForSale:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user properties",
    });
  }
};
