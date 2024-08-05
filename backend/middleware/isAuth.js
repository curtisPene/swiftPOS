const jwt = require("jsonwebtoken");
const isAuth = async (req, res, next) => {
  // Get access token from cookies
  const accessToken = req.cookies["swf_access"];

  // If no access token throw error with 400
  if (!accessToken) {
    const error = new Error("Authentication failed");
    error.status = 400;
    error.code = "USER_NOT_AUTHENTICATED";
    return next(error);
  }

  // Decode and verify access token
  try {
    const token = jwt.verify(accessToken, process.env.JWT_SECRET);
  } catch (e) {
    const error = new Error("Authentication failed");
    if (e.name === "TokenExpiredError") {
      error.status = 401;
      error.code = "USER_EXPIRED_ACCESS_TOKEN";
      return next(error);
    }
    error.status = 400;
    error.code = "USER_DEFORMED_ACCESS_TOKEN";
    return next(error);
  }
  next();
};

module.exports = isAuth;
