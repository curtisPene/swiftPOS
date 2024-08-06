const express = require("express");
const adminController = require("../controllers/adminController");
const validator = require("../middleware/validatorMiddleware");

const router = express.Router();

router.post(
  "/product",
  validator.addProductValidator,
  adminController.addProduct
);

module.exports = router;
