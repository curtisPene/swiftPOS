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
    // Create two test users
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

module.exports = seedDatabase;
