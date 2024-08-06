const ProductVariant = require("../models/productVariantModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

exports.addProduct = async (req, res, next) => {
  // Get product details and location from request body
  const { location, brand, description, category, variant } = req.body;
  // Get location id from request object
  const locationId = req.user.location;
  // Create new product
  const newProduct = new Product({
    brand,
    description,
    category,
  });
  // Create new variant
  const newVariant = new ProductVariant({
    ...variant,
  });
  // Start session with transaction
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      // Save variant and get id
      const variant = await newVariant.save({ session });
      // Save product and add variant to product
      const product = await newProduct.save({ session });
      product.variants.push(variant._id);
      await product.save({ session });
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
