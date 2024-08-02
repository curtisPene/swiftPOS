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

exports.loginValidator = [
  body("email", "Valid email is required")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail(),
  body("password", "Password is required").trim().escape().notEmpty(),
];
