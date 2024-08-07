const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Location = require("./models/Location");
const Product = require("./models/Product");
const ProductVariant = require("./models/ProductVariant");

const productCategories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Canned & Packaged Goods",
  "Frozen Foods",
  "Beverages (Non-Alcoholic)",
  "Snacks",
  "Household Supplies",
  "Personal Care",
  "Health & Wellness",
  "Baby Products",
  "Pet Supplies",
  "International Foods",
  "Organic & Natural Foods",
  "Beverages (Alcoholic)",
  "Tobacco",
];

// Connect to the MongoDB database
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Function to generate an access token
exports.generateAccessToken = (
  userId,
  locationId,
  role,
  validSign,
  expired
) => {
  const payload = {
    sub: userId,
    location: locationId,
    role: role,
  };

  let exp;

  if (expired) {
    exp = Math.floor(Date.now() / 1000) - 15 * 60;
  } else {
    exp = Math.floor(Date.now() / 1000) + 60 * 60;
  }

  return jwt.sign(
    payload,
    validSign ? process.env.JWT_SECRET : "This isnt the secret",
    { expiresIn: exp }
  );
};

// Seed the database with test data
const seedDatabase = async () => {
  // To-do: refactor this block into seperate functions
  try {
    await connectDB();
    // Create two test users with role admin
    const admin1 = await User.create({
      email: "admin1@gmail.com",
      password: "password1",
      location: new mongoose.Types.ObjectId(),
      firstName: "John",
      lastName: "Doe",
      role: "admin",
    });

    const user2 = await User.create({
      email: "admin2@gmail.com",
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

    // Add the locations to the users and admins
    admin1.location = location1._id;
    admin2.location = location2._id;
    user3.location = location1._id;
    user4.location = location2._id;

    await admin1.save();
    await admin2.save();
    await user1.save();
    await user2.save();

    // Add the users to the locations users array
    location1.users.push(user3._id);
    location2.users.push(user4._id);

    await location1.save();
    await location2.save();

    // Create two test products and save
    const product1 = await Product.create({
      location: location1._id,
      brand: "Brand 1",
      description: "Description 1",
      category: Math.floor(Math.random() * productCategories.length + 1),
      variants: [],
    });

    const product2 = await Product.create({
      location: location2._id,
      brand: "Brand 2",
      description: "Description 2",
      category: Math.floor(Math.random() * productCategories.length + 1),
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

    // Add the variants to the products
    product1.variants.push(variant1._id);
    product2.variants.push(variant2._id);

    await product1.save();
    await product2.save();

    return {
      user1,
      user2,
      user3,
      user4,
      location1,
      location2,
      product1,
      product2,
      variant1,
      variant2,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    console.log("Database seeded successfully");
    await mongoose.disconnect();
  }
};

module.exports = seedDatabase;
