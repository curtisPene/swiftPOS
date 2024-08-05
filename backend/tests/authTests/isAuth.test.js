const jwt = require("jsonwebtoken");
const isAuth = require("../../middleware/isAuth");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const chalk = require("chalk");
const httpMocks = require("node-mocks-http");

describe("isAuth middleware", () => {
  let accessToken, expiredAccessToken, invalidAccessToken;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
    const user = await User.create({
      email: "user@gmail.com",
      password: "password",
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });

    accessToken = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
      },
      process.env.JWT_SECRET
    );

    expiredAccessToken = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) - 15 * 60,
      },
      process.env.JWT_SECRET
    );

    invalidAccessToken = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
      },
      "dzfgrfjdfhdfg"
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(() => {
    req = { cookies: {} };
    res = {};
    next = jest.fn(); // Mock function to track calls
  });

  test("User with valid access token", async () => {
    req.cookies = { swf_access: accessToken };

    await isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test("User with expired access token", async () => {
    req.cookies = { swf_access: expiredAccessToken };

    await isAuth(req, res, next);

    // Get the first call's arguments
    const [error] = next.mock.calls[0];

    // Verify the error object
    expect(error.message).toBe("Authentication failed");
    expect(error.status).toBe(401);
    expect(error.code).toBe("USER_EXPIRED_ACCESS_TOKEN");
  });

  test("User with invalid access token", async () => {
    req.cookies = { swf_access: invalidAccessToken };

    await isAuth(req, res, next);

    // Get the first call's arguments
    const [error] = next.mock.calls[0];
    console.log(error);

    // Verify the error object
    expect(error.message).toBe("Authentication failed");
    expect(error.status).toBe(400);
    expect(error.code).toBe("USER_MALFORMED_ACCESS_TOKEN");
  });

  test("User without access token", async () => {
    req.cookies = { swf_access: "" };

    await isAuth(req, res, next);

    // Get the first call's arguments
    const [error] = next.mock.calls[0];
    console.log(error);

    // Verify the error object
    expect(error.message).toBe("Authentication failed");
    expect(error.status).toBe(400);
    expect(error.code).toBe("USER_NOT_AUTHENTICATED");
  });
});
