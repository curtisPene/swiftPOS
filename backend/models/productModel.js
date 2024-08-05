const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      required: true,
    },
    variants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = productSchema.model("Product", productSchema);
