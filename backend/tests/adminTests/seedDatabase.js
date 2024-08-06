const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Location = require("./models/Location");
const Product = require("./models/Product");
const ProductVariant = require("./models/ProductVariant");

// Connect to the MongoDB database
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Function to generate an access token
const generateAccessToken = (userId, locationId, role) => {
  const payload = {
    sub: userId,
    location: locationId,
    role: role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Seed the database with test data
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Location.deleteMany({});
    await Product.deleteMany({});
    await ProductVariant.deleteMany({});

    // Create a test user
    const user = await User.create({
      email: "user@gmail.com",
      password: "password",
      firstName: "curtis",
      lastName: "pene",
      role: "admin",
    });

    // Create a test location associated with the user
    const location = await Location.create({
      name: "Location1",
      admin: user._id,
      users: [user._id],
    });

    // Update the user with the location
    await User.findByIdAndUpdate(user._id, { location: location._id });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, location._id, user.role);
    const expiredAccessToken = jwt.sign(
      {
        sub: user._id,
        location: location._id,
        role: user.role,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) - 15 * 60,
      },
      process.env.JWT_SECRET
    );

    const invalidAccessToken = jwt.sign(
      {
        sub: user._id,
        location: location._id,
        role: user.role,
        iss: process.env.DEV_DOMAIN,
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
      },
      "incorrect_secret"
    );

    // Return all data needed for tests
    return {
      user,
      location,
      accessToken,
      expiredAccessToken,
      invalidAccessToken,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

module.exports = seedDatabase;
