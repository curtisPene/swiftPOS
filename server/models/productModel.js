const mongoose = require("mongoose");

exports.productCategories = [
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

const productSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: exports.productCategories,
    },
    variants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProductVariant",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
