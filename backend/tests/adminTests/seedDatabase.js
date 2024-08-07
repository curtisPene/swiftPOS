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
exports.generateAccessToken = (userId, locationId, role) => {
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
    // Create two test users with role admin
    const user1 = await User.create({
      email: "user1@gmail.com",
      password: "password1",
      location: new mongoose.Types.ObjectId(),
      firstName: "John",
      lastName: "Doe",
      role: "admin",
    });

    const user2 = await User.create({
      email: "user2@gmail.com",
      password: "password2",
      location: new mongoose.Types.ObjectId(),
      firstName: "Jane",
      lastName: "Doe",
      role: "admin",
    });

    // Create two test users with role user
    const user3 = await User.create({
      email: "user3@gmail.com",
      password: "password3",
      location: new mongoose.Types.ObjectId(),
      firstName: "Bob",
      lastName: "Smith",
      role: "user",
    });

    const user4 = await User.create({
      email: "user4@gmail.com",
      password: "password4",
      location: new mongoose.Types.ObjectId(),
      firstName: "Alice",
      lastName: "Johnson",
      role: "user",
    });

    // const create two test locations
    const location1 = await Location.create({
      name: "Location 1",
      admin: new mongoose.Types.ObjectId(),
      products: [],
    });

    const location2 = await Location.create({
      name: "Location 2",
      admin: new mongoose.Types.ObjectId(),
      products: [],
    });

    // Add the admin users to locations
    user1.location = location1._id;
    user2.location = location1._id;
    user3.location = location2._id;
    user4.location = location2._id;

    await user1.save();
    await user2.save();
    await user3.save();
    await user4.save();

    // Add the admin users to locations
    location1.admin = user1._id;
    location2.admin = user3._id;
    await location1.save();
    await location2.save();

    // Add the other users to locations in the users array
    location1.users.push(user3._id);
    location2.users.push(user4._id);

    await location1.save();
    await location2.save();

    // Create two test products and save
    const product1 = await Product.create({
      location: new mongoose.Types.ObjectId(),
      brand: "Brand 1",
      description: "Description 1",
      category: "Category 1",
      variants: [],
    });

    const product2 = await Product.create({
      location: new mongoose.Types.ObjectId(),
      brand: "Brand 2",
      description: "Description 2",
      category: "Category 2",
      variants: [],
    });

    await product1.save();
    await product2.save();

    // Create two test variants and save
    const variant1 = await ProductVariant.create({
      location: location1._id,
      product: product1._id,
      price: 10.0,
      quantity: 10,
    });

    const variant2 = await ProductVariant.create({
      location: location2._id,
      product: product2._id,
      price: 20.0,
      quantity: 20,
    });

    await variant1.save();
    await variant2.save();
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    console.log("Database seeded successfully");
    await mongoose.disconnect();
  }
};

module.exports = seedDatabase;
