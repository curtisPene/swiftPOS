const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const isAuth = async (req, res, next) => {
  // Get access token from cookies
  const accessToken = req.cookies["swf_access"];

  if (!accessToken || accessToken === "") {
    const error = new Error("Authentication failed");
    error.status = 400;
    error.code = "USER_NOT_AUTHENTICATED";
    return next(error);
  }

  // Decode and verify access token
  try {
    jwt.verify(accessToken, process.env.JWT_SECRET);
  } catch (e) {
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

    return next(e);
  }

  // Decode access token payload
  const payload = jwt.decode(accessToken);

  req.user = payload.sub;
  req.location = payload.location;

  next();
};

module.exports = isAuth;
