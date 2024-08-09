const { matchedData, validationResult } = require("express-validator");
const Location = require("../models/locationModel");
const Product = require("../models/productModel");
const ProductVariant = require("../models/productVariantModel");
const Sale = require("../models/saleModel");
const mongoose = require("mongoose");

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

// Get a single product and its variants for location
exports.getProduct = async (req, res, next) => {
  // Get product id from request params
  const { productId } = req.params;
  // Get product - populate variants
  const product = await Product.findById(productId).populate("variants");

  if (!product) {
    const error = new Error("Incorrect product id. No product found");
    const code = "PRODUCT_INVALID_IDENTIFIER";
    error.status(400);
    return next(error);
  }
  // Validate product location against req.user location
  const isAuthorized = product.location.equals(req.location);
  if (!isAuthorized) {
    const error = new Error("Not authorized to view this product");
    error.code = "USER_NOT_AUTHORIZED";
    error.status = 401;
    return next(error);
  }
  // Return product
  res.send(product);
};

// Get a single variant for a product line
exports.getVariant = async (req, res, next) => {
  // Get variant id from request params
  const { variantId } = req.params;
  // Get variant from database
  const variant = await ProductVariant.findById(variantId);
  // Compare user location to variant location
  isAuthorized = variant.location.equals(req.location);
  if (!isAuthorized) {
    const error = new Error("Not authorized to view this variant");
    error.code = "USER_NOT_AUTHORIZED";
    error.status = 401;
    return next(error);
  }
  // Return variant
  res.status(200).json({
    message: "Variant fetched successfully",
    code: "VARIANT_FOUND",
    data: variant,
  });
};
