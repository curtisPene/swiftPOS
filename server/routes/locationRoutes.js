const express = require("express");
const locationController = require("../controllers/locationController");
const validator = require("../middleware/validatorMiddleware");
const asyncErrorMiddleware = require("../middleware/asyncErrorMiddleware");
const salesController = require("../controllers/salesController");

const router = express.Router();

// Get all products for location
router.get("/products", asyncErrorMiddleware(locationController.getProducts));

// Get a single product and all its variants for location
router.get(
  "/product/:productId",
  asyncErrorMiddleware(locationController.getProduct)
);

// Get a single variant for location
router.get(
  "/product/variant/:variantId",
  asyncErrorMiddleware(locationController.getVariant)
);

// Post a single sale for location
router.post(
  "/sale",
  validator.postSaleValidator,
  asyncErrorMiddleware(salesController.postSale)
);

// Get all sales for location
router.get("/sales", asyncErrorMiddleware(salesController.getSales));

module.exports = router;
