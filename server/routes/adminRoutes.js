const express = require("express");
const adminController = require("../controllers/adminController");
const validator = require("../middleware/validatorMiddleware");
const asyncErrorMiddleware = require("../middleware/asyncErrorMiddleware");

const router = express.Router();

router.post(
  "/product",
  validator.addProductValidator,
  asyncErrorMiddleware(adminController.addProduct)
);

router.patch(
  "/product/:productId",
  validator.updateProductValidator,
  asyncErrorMiddleware(adminController.updateProduct)
);

router.delete(
  "/product/:variantId",
  asyncErrorMiddleware(adminController.deleteVariant)
);

router.post(
  "/product/:productId/variant",
  validator.addVariantValidator,
  asyncErrorMiddleware(adminController.addVariant)
);

module.exports = router;
