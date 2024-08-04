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
  const token = jwt.verify(accessToken, process.env.JWT_SECRET);

  if (!accessToken || !accessToken) {
    const error = new Error("Authentication failed");
    error.status = 400;
    error.code = "USER_NOT_AUTHENTICATED";
    return next(error);
  }

  // If token expired but valid throw error with 401 - Signal client to request new access token
  const tokenPayload = jwt.decode(accessToken, { complete: true });
  const currentTime = Math.floor(Date.now() / 1000);
  const tokenExpired = tokenPayload.payload.exp < currentTime;

  if (tokenExpired) {
    const error = new Error("Token expired");
    error.status = 401;
    error.code = "USER_TOKEN_EXPIRED";
    return next(error);
  }
  console.log("User authenticated");
  next();
};

module.exports = isAuth;
