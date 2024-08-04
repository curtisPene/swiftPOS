const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../../app");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI_LOCAL);
    const hashedPasword = await bcrypt.hash("password", 10);
    await User.create({
      email: "user@gmail.com",
      password: hashedPasword,
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });
  });

  test("Succesful user login ", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "user@gmail.com",
      password: "password",
    });

    expect(response.status).toBe(202);
    expect(response.headers).toHaveProperty("set-cookie");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body.message).toBe("User logged in");

    const cookies = response.headers["set-cookie"][0].split(";");
    expect(cookies).toBeDefined();
    expect(cookies[0].split("=")[0]).toBe("Authorization");
    expect(
      jwt.verify(cookies[0].split("=")[1], process.env.JWT_SECRET)
    ).toBeTruthy();
    expect(response.body).toHaveProperty("code", "USER_AUTHENTICATED");
  });

  test("Missing login field value", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.code).toBe("USER_VALIDATION_FAILED");
  });

  test("Invalid email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "invaliduser@gmail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
    expect(response.body.code).toBe("USER_INVALID_CREDENTIALS");
  });

  test("Invalid password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "user@gmail.com",
      password: "invalidpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
    expect(response.body.code).toBe("USER_INVALID_CREDENTIALS");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
