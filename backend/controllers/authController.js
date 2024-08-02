const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

// Creates a new user
exports.postSignup = async (req, res, next) => {
  // Check for validation errors
  const erors = validationResult(req);

  if (!erors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.message = erors.array();
    return next(error);
  }

  // Get fName, lName, email, and password from request body via express-validator matchedData
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

exports.postLogin = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors.array();
    error.code = "VALIDATION_FAILED";
    return next(error);
  }

  // Get email and password from request body via express-validator matchedData
  const { email, password } = matchedData(req);
  // Verify userId
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 400;
    error.code = "USER_INVALID_CREDENTIALS";
  }
  // Verify password
  const hashedPassword = user.password;
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 400;
    error.code = "USER_INVALID_CREDENTIALS";
    return next(error);
  }

  // Create JWT and create cookie
  const token = await jwt.sign(
    {
      sub: user._id,
      role: user.role,
      iss: process.env.domain,
    },
    process.env.JWT_SECRET
  );

  res.cookie("Authorization", token, {
    httpOnly: true,
    sameSite: true,
    domain: process.env.domain,
  });

  // Send response with JWT
  res.status(201).json({
    status: 200,
    data: {
      token,
    },
    message: "User logged in",
  });
};
