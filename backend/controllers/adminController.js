const ProductVariant = require("../models/productVariantModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const Location = require("../models/locationModel");
const { validationResult, matchedData } = require("express-validator");

exports.addProduct = async (req, res, next) => {
  // Get validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const error = new Error("Validation failed");
    error.message = errors.array();
    error.code = "VALIDATION_ERROR";
    error.status = 400;
    return next(error);
  }
  // Get product details from validator
  const { brand, description, category, variant } = matchedData(req);
  // Get location id from request object
  const locationId = req.location;
  // Create new product
  const newProduct = new Product({
    brand,
    description,
    category,
    location: req.location,
  });
  // Create new variant
  const newVariant = new ProductVariant({
    ...variant,
    location: req.location,
    product: new mongoose.Types.ObjectId(),
  });
  // Get location from database - id stored in request object
  let location;
  try {
    location = await Location.findById(locationId);
  } catch (e) {
    console.log(e.message);
    const error = new Error("Invalid location specified in request");
    error.code = "LOCATION_INVALID_REQUEST";
    return next(error);
  }

  // Start session with transaction
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      // Save product
      const product = await newProduct.save({ session });
      // Save variant
      const variant = await newVariant.save({ session });
      // Add variant id to product variants array
      product.variants.push(variant._id);
      await product.save({ session });
      // Add product Id to variant
      variant.product = product._id;
      await variant.save({ session });
      // Add product to location
      location.products.push(product._id);
      await location.save({ session });
      // Return response
      res.status(201).json({
        message: "Product created",
        code: "PRODUCT_CREATED",
        data: product,
      });
    });
  } catch (e) {
    console.log(e.message);
    const error = new Error("Failed to save product");
    error.statusCode = 500;
    error.code = "PRODUCT_SAVE_FAILED";
    return next(error);
  } finally {
    session.endSession();
  }
};

exports.updateProduct = async (req, res, next) => {
  // Get validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const error = new Error("Validation failed");
    error.message = errors.array();
    error.code = "VALIDATION_ERROR";
    return next(error);
  }
  // Get validated data from matchedData function
  const { brand, description, category } = matchedData(req);
  // Find product in database - id in request params
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Incorrect product id");
    error.code = "PRODUCT_NOT_FOUND";
    return next(error);
  }
  // Ensure user is admin at product location
  const allowUpdate =
    req.role === "admin" && product.location.toString() === req.location;
  if (!allowUpdate) {
    const error = new Error("Not authorized to update this product");
    error.code = "PRODUCT_NOT_AUTHORIZED";
    return next(error);
  }
  // Update and save product
  product.brand = brand;
  product.description = description;
  product.category = category;
  await product.save();
  // Return response
  res.status(200).json({
    message: "Product updated",
    code: "PRODUCT_UPDATED",
    data: product,
  });
};
