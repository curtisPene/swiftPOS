const mongoose = require("mongoose");
const Sale = require("../models/saleModel");
const Location = require("../models/locationModel");
const { matchedData, validationResult } = require("express-validator");
const ProductVariant = require("../models/productVariantModel");

// Create a new sale at location
exports.postSale = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.data = errors.array();
    error.code = "VALIDATION_FAILED";
    return next(error);
  }
  // Get matched data
  const saleData = matchedData(req);
  // Verify sale location and req.location are the same
  const sameLocation = saleData.location === req.location;
  if (!sameLocation) {
    const error = new Error(
      "User not authorized to create sale at this location"
    );
    error.code = "USER_NOT_AUTHORIZED";
    error.status = 401;
    return next(error);
  }
  // Create new sale object
  const sale = new Sale({
    ...saleData,
  });

  // Get location from database
  const location = await Location.findById(saleData.location);

  if (!location) {
    const error = new Error("Location specified in sale not found");
    error.code = "LOCATION_NOT_FOUND";
    error.status = 404;
    return next(error);
  }

  // Start session with transaction
  const session = await mongoose.startSession();
  try {
    session.withTransaction(async () => {
      // Save sale
      await sale.save();
      // Add sale to location
      location.sales.push(sale);
      // Save sale
      location.save();
      // Get all variants in sale and decrease stock by quantity in sale data
      saleData.transactionItems.forEach(async (item) => {
        const variant = await ProductVariant.findById(item.variant);
        variant.stock = variant.stock - item.quantity;
        await variant.save();
      });
      // Return response
      res.status(201).json({
        message: "Sale processed successfully",
        code: "SALE_PROCESSED",
        data: sale,
      });
    });
  } catch (e) {
    const error = new Error("Encountered a problem while procssing sale item");
    error.code = "SALE_PROCESSING_ERROR";
    error.status = 500;
    return next(error);
  } finally {
    await session.endSession();
  }
};
