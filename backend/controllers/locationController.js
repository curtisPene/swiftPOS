const Location = require("../models/locationModel");

exports.getLocationProducts = async (req, res, next) => {
  // Get location id from request body
  const locationId = req.body.locationId;
  // Get location - populate products with variants
  try {
    const locationProducts = await Location.findById(locationId).populate(
      "variants"
    );
  } catch (ereror) {
    const error = new Error(e.message);
    error.code = "LOCATION_ERROR_LOADING_REQUESTED_DATA";
    return next(error);
  }
  // Return location products
  res.status(200).json({
    message: "Location products fetched successfully",
    code: "LOCATION_PRODUCTS_FOUND",
    data: locationProducts,
  });
};
