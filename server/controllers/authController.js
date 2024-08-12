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

  // Create new location and add user as admin
  const location = new Location({
    name: "Main Location",
    admin: new mongoose.Types.ObjectId(),
    products: [],
  });

  // Create new user and add location to user
  const user = new User({
    email,
    password: hashedPasword,
    location: new mongoose.Types.ObjectId(),
    firstName,
    lastName,
    role: "admin",
  });

  // Create session with transaction and attemp writes to database
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async (session) => {
      // Save location and user
      await user.save({ session });
      await location.save({ session });
      // Add refs to each other
      user.location = location._id;
      location.admin = user._id;
      await user.save({ session });
      await location.save({ session });
    });
    // return response
    res.status(201).json({
      message: "User created",
      code: "USER_CREATED",
    });
  } catch (e) {
    console.log(e.message);
    const error = new Error("Failed to save user");
    error.status = 500;
    return next(error);
  } finally {
    await session.endSession();
  }
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

  // Get user's role and location
  const role = user.role;

  // Create JWT'S - Access and refresh token
  const accessToken = jwt.sign(
    {
      sub: user._id,
      role: user.role,
      location: user.location,
      iss: process.env.DEV_DOMAIN,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiry
    },
    process.env.JWT_SECRET
  );

  const refreshToken = jwt.sign(
    {
      sub: user._id,
      role: user.role,
      location: user.location,
      iss: process.env.DEV_DOMAIN,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days expiry
    },
    process.env.JWT_SECRET_REFRESH
  );

  // Set cookies in the response
  res.cookie("swf_access", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure in production
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("swf_refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure in production
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  // Send response with JWT
  res.status(202).json({
    code: "USER_AUTHENTICATED",
    message: "User logged in",
  });
};

exports.postLogout = (req, res, next) => {
  // Clear cookies
  res.clearCookie("swf_access");
  res.clearCookie("swf_refresh");
  res.status(200).json({
    message: "User logged out",
    code: "USER_LOGGED_OUT",
  });
  // Send response
};
