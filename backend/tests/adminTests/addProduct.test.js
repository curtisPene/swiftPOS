const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const Location = require("../../models/locationModel");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

describe("POST /api/admin/addProduct", () => {
  let location, user, accessToken;
  beforeAll(async () => {
    const connection = await mongoose.connect(process.env.MONGO_TEST_URI);
    user = await User.create({
      email: "curtispene92@gmail.com",
      password: "crowbar69",
      location: new mongoose.Types.ObjectId(),
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });
    location = await Location.create({
      name: "Main Location",
      admin: new mongoose.Types.ObjectId(),
    });
    location.admin = user._id;
    await location.save();
    user.location = location._id;
    await user.save();
    accessToken = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        location: user.location,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiry
      },
      process.env.JWT_SECRET
    );
  });

  test("Add product with correct request body", async () => {
    const response = await request(app)
      .post("/api/admin/product")
      .set("Cookie", `swf_access=${accessToken}`)
      .send({
        brand: "Coca-Cola",
        description: "Fizzy boy",
        category: "Beverages (Non-Alcoholic)",
        variant: {
          variantName: "Coke",
          price: 3.8,
          attributes: [{ volume: "600ml" }],
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product created");
    expect(response.body.code).toBe("PRODUCT_CREATED");
    expect(response.body.data).toHaveProperty("location");
    expect(response.body.data).toHaveProperty("variants");
  });

  afterAll(async () => {
    mongoose.connection.close();
    mongoose.connection.dropDatabase();
  });
}, 10000);
