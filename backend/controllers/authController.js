const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Location = require("../models/locationModel");

const mongoose = require("mongoose");

// Creates a new user
exports.postSignup = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.message = errors.array();
    error.code = "USER_VALIDATION_FAILED";
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
    role: "admin",
  });

  // Create new location and add user as admin
  const location = new Location({
    name: "Main Location",
    admin: user._id,
  });

  // Create session with transaction and attemp writes to database
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async (session) => {
      await user.save({ session });
      await location.save({ session });
    });
  } catch (e) {
    const error = new Error("Failed to save user");
    return next(error);
  }

  // return response
  res.status(201).json({
    message: "User created",
    code: "USER_CREATED",
  });
};

exports.postLogin = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.message = errors.array();
    error.code = "USER_VALIDATION_FAILED";
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
    return next(error);
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

  // Create JWT'S - Access and refresh token
  const accessToken = jwt.sign(
    {
      sub: user._id,
      role: user.role,
      iss: process.env.DEV_DOMAIN,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiry
    },
    process.env.JWT_SECRET
  );

  const refreshToken = jwt.sign(
    {
      sub: user._id,
      role: user.role,
      iss: process.env.DEV_DOMAIN,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days expiry
    },
    process.env.JWT_SECRET_REFRESH
  );

  res.cookie("swf_refresh", refreshToken);

  res.cookie("swf_access", accessToken);

  // Send response with JWT
  res.status(202).json({
    code: "USER_AUTHENTICATED",
    message: "User logged in",
  });
};
