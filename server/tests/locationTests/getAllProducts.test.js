const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Location = require("../../models/locationModel");
const ProductVariant = require("../../models/productVariantModel");
const jwt = require("jsonwebtoken");

describe("GET /api/location/products", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);

    // Create admin user
    adminUser = await User.create({
      email: "curtispene92@gmail.com",
      password: "crowbar69",
      location: new mongoose.Types.ObjectId(),
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });

    // Create location
    location = await Location.create({
      name: "Main Location",
      admin: new mongoose.Types.ObjectId(),
    });

    // Add refs to User and Location documents - save
    location.admin = adminUser._id;
    await location.save();
    adminUser.location = location._id;
    await adminUser.save();

    // Create user with role-user
    const user = await User.create({
      email: "user@example.com",
      location: location._id,
      password: "password",
      firstName: "test",
      lastName: "user",
      role: "user",
    });

    // Add user to location
    location.users.push(user._id);

    await location.save();

    // Create product
    product = await Product.create({
      location: location._id,
      brand: "Coca-Cola",
      description: "Fizzy boy",
      category: "Beverages (Non-Alcoholic)",
      variants: [],
    });

    // Create product variant
    const productVariant = await ProductVariant.create({
      variantName: "Coke",
      location: location._id,
      product: product._id,
      price: 3.8,
      attributes: [{ key: "Volume", value: "600ml" }],
      stock: 10,
    });

    // Add variant to product
    product.variants.push(productVariant._id);
    await product.save();
    // Add product to location
    location.products.push(product._id);
    await location.save();

    // Generate access token
    accessToken = jwt.sign(
      {
        sub: adminUser._id,
        role: adminUser.role,
        location: adminUser.location,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes expiry
      },
      process.env.JWT_SECRET
    );

    // Generate user role access token
    userRoletoken = jwt.sign(
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

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("Get all products for location with authorized user", async () => {
    const response = await request(app)
      .get("/api/location/products")
      .set("Cookie", `swf_access=${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe("LOCATION_PRODUCTS_FOUND");
    expect(response.body.data).toBeDefined();
  });

  test("Get all products for location with unauthorized user", async () => {
    const response = await request(app)
      .get("/api/location/products")
      .set("Cookie", `swf_access=${userRoletoken}`);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("USER_UNAUTHORIZED");
  });
});
