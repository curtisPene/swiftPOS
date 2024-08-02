const { body } = require("express-validator");

exports.signupValidator = [
  body("firstName", "First name is required")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("lastName", "Last name is required")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("email", "Valid email is required")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email address"),

  body("password", "Password is required")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password cannot be empty"),
];
