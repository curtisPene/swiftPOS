const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const isAuth = async (req, res, next) => {
  // Get access token from cookies
  const accessToken = req.cookies["swf_access"];

  console.log(accessToken);

  if (!accessToken || accessToken === "") {
    const error = new Error("Authentication failed");
    error.status = 400;
    error.code = "USER_NOT_AUTHENTICATED";
    return next(error);
  }

  // If no access token throw error with 400
  if (!accessToken) {
    const error = new Error("Authentication failed");
    error.status = 400;
    error.code = "USER_NOT_AUTHENTICATED";
    return next(error);
  }

  // Decode and verify access token
  try {
    jwt.verify(accessToken, process.env.JWT_SECRET);
  } catch (e) {
    console.log(chalk.bgGreenBright(e.name));
    if (e.name === "TokenExpiredError") {
      const error = new Error("Authentication failed");
      error.status = 401;
      error.code = "USER_EXPIRED_ACCESS_TOKEN";
      return next(error);
    }

    if (e.name === "JsonWebTokenError") {
      const error = new Error("Authentication failed");
      error.status = 400;
      error.code = "USER_MALFORMED_ACCESS_TOKEN";
      return next(error);
    }
    return next(error);
  }

  next();
};

module.exports = isAuth;
