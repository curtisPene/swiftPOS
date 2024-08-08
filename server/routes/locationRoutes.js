const express = require("express");
const locationController = require("../controllers/locationController");

const router = express.Router();

// Get all products for location
router.get("/products", locationController.getProducts);

// Get a single product and all its variants for location
router.get("/product/:productId", locationController.getProduct);

// Get a single variant for location
router.get("/product/variant/:variantId", locationController.getVariant);

module.exports = router;
