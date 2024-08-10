const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../../app");
const User = require("../../models/userModel");

describe("POST /api/auth/signup", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase(); // Reset the database before each test
  });

  test("should create a new user and return a 201 status code", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "curtispene92@gmail.com",
      password: "crowbar69",
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created");
    expect(response.body).toHaveProperty("code", "USER_CREATED");
  });

  test("Should return 400 status code if validation fails", async () => {
    const response = await request(app).post("/api/auth/signup").send({});

    expect(response.body).toHaveProperty("status", 400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("code", "USER_VALIDATION_FAILED");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
