const { body } = require("express-validator");

// Validate POST /api/auth/signup
exports.signupValidator = [
  body("firstName", "First name is required").trim().escape().notEmpty(),
  body("lastName", "Last name is required").trim().escape().notEmpty(),
  body("email", "Valid email is required")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail(),
  body("password", "Password is required").trim().escape().notEmpty(),
];

// Validate POST /api/auth/login
exports.loginValidator = [
  body("email", "Valid email is required")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail(),
  body("password", "Password is required").trim().escape().notEmpty(),
];

// Validate GET /api/admin/product
exports.addProductValidator = [
  body("brand", "Brand is required").notEmpty().trim().escape(),
  body("description", "Description is required").notEmpty().trim().escape(),
  body("category", "Category is required").notEmpty().trim().escape(),
  body("variant").custom((value) => {
    if (typeof value !== "object" || value === null) {
      throw new Error("Variant must be an object");
    }
    if (
      !value.variantName ||
      typeof value.variantName !== "string" ||
      value.variantName.trim() === ""
    ) {
      throw new Error(
        "Variant name is required and must be a non-empty string"
      );
    }
    if (!value.price || typeof value.price !== "number" || value.price <= 0) {
      throw new Error("Price is required and must be a positive number");
    }
    if (!Array.isArray(value.attributes) || value.attributes.length === 0) {
      throw new Error("Attributes must be a non-empty array");
    }
    return true;
  }),
];

// Validate PATCH /api/admin/product/:productId
exports.updateProductValidator = [
  body("brand").notEmpty().trim().escape(),
  body("description").notEmpty().trim().escape(),
  body("category").notEmpty().trim().escape(),
];

// Validate POST /api/admin/product/:productId/variant
exports.addVariantValidator = [
  body("variantName", "Variant name is required").notEmpty().trim().escape(),
  body("location", "Location is required").notEmpty().trim().escape(),
  body("price", "Price is required").notEmpty().trim().escape(),
  body("attributes", "Attributes are required").notEmpty().trim().escape(),
  body("stock", "Stock is required").notEmpty().trim().escape(),
  body("product", "Product is required").notEmpty().trim().escape(),
];

// Validate PATCH /api/admin/product/:variantId
exports.updateVariantValidator = [
  body("variantName", "Variant name is required").notEmpty().trim().escape(),
  body("location", "Location is required").notEmpty().trim().escape(),
  body("price", "Price is required").notEmpty().trim().escape(),
  body("attributes", "Attributes are required").notEmpty().trim().escape(),
  body("stock", "Stock is required").notEmpty().trim().escape(),
  body("product", "Product is required").notEmpty().trim().escape(),
];
