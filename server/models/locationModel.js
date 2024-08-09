const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    sales: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Sale",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
