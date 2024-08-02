const express = require("express");
const authController = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
} = require("../middleware/validatorMiddleware");

const asyncErrorMiddleware = require("../middleware/asyncErrorMiddleware");

const router = express.Router();

// POST /api/auth/signup route handler - creates a new user
router.post("/signup", [
  signupValidator,
  asyncErrorMiddleware(authController.postSignup),
]);

// POST /api/auth/login route handler - logs in a user
router.post("/login", [
  loginValidator,
  asyncErrorMiddleware(authController.postLogin),
]);

module.exports = router;
