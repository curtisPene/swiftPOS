const express = require("express");
const authController = require("../controllers/authController");
const { signupValidator } = require("../middleware/validatorMiddleware");

const asyncErrorMiddleware = require("../middleware/asyncErrorMiddleware");

const router = express.Router();

router.post("/signup", [
  signupValidator,
  asyncErrorMiddleware(authController.postSignup),
]);

module.exports = router;
