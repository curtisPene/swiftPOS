const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");

const User = require("../models/userModel");

// Creates a new user
exports.postSignup = async (req, res, next) => {
  // Check for validation errors
  const erors = validationResult(req);

  if (!erors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.message = erors.array();
    return next(error);
  }

  // Get fName, lName, email, and password from request body
  const { firstName, lastName, email, password } = matchedData(req);

  // Hash password
  const hashedPasword = await bcrypt.hash(password, 10);
  // Create new user
  const user = new User({
    email,
    password: hashedPasword,
    firstName,
    lastName,
  });
  // Save user to database
  await user.save();

  // return response
  res.status(201).json({
    status: "success",
    message: "User created",
  });
};
