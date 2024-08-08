const express = require("express");
const adminController = require("../controllers/adminController");
const validator = require("../middleware/validatorMiddleware");
const asyncErrorMiddleware = require("../middleware/asyncErrorMiddleware");

const router = express.Router();

// Add new product to location
router.post(
  "/product",
  validator.addProductValidator,
  asyncErrorMiddleware(adminController.addProduct)
);

// Update product - excluding variant data
router.patch(
  "/product/:productId",
  validator.updateProductValidator,
  asyncErrorMiddleware(adminController.updateProduct)
);

// Delete a variant from a product and delete product if no variants remain
router.delete(
  "/product/:variantId",
  asyncErrorMiddleware(adminController.deleteVariant)
);

// Add variant to product
router.post(
  "/product/:productId/variant",
  validator.addVariantValidator,
  asyncErrorMiddleware(adminController.addVariant)
);

// Update variant
router.patch(
  "/product/variant/:variantId",
  validator.updateVariantValidator,
  asyncErrorMiddleware(adminController.updateVariant)
);

module.exports = router;
