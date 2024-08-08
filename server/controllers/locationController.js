const Location = require("../models/locationModel");

exports.getProducts = async (req, res, next) => {
  // Get location id from request body
  const locationId = req.body.locationId;
  // Get location - populate products with variants
  try {
    const locationProducts = await Location.findById(locationId).populate(
      "products"
    );
    // Send response if location has no products to fetch
    if (!locationProducts) {
      return res.status(200).json({
        message: "No products found at location",
        code: "LOCATION_PRODUCTS_NOT_FOUND",
        data: {
          products: [],
        },
      });
    }
    // Return location products
    return res.status(200).json({
      message: "Location products fetched successfully",
      code: "LOCATION_PRODUCTS_FOUND",
      data: locationProducts,
    });
  } catch (e) {
    console.log(e.message);
    const error = new Error("Could not fetch products for specified location");
    error.code = "LOCATION_ERROR_LOADING_REQUESTED_DATA";
    return next(error);
  }
};
