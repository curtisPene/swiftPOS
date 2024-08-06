const { body } = require("express-validator");

// Validate POST /api/auth/signup request
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

// Validate POST /api/auth/login request
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
