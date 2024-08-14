const express = require("express");
const authController = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
  postResetValidator,
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

// POST /api/auth/logout route handler - logs out a user
router.post("/logout", asyncErrorMiddleware(authController.postLogout));

// POST /api/auth/passwordreset route handler - resets a user's password
router.post("/passwordreset", [
  postResetValidator,
  asyncErrorMiddleware(authController.postReset),
]);

// PATCH /api/auth/passwordreset/:token route handler - resets a user's password
router.patch(
  "/passwordreset",
  asyncErrorMiddleware(authController.patchPasswordReset)
);

module.exports = router;
