const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    saleStatus: {
      type: String,
      enum: ["pending", "complete", "voided"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    transactionItems: [
      {
        variant: {
          type: mongoose.Types.ObjectId,
          ref: "ProductVariant",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    tax: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "cash", "mpaisa", "mycash"],
    },
    paymentReference: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);
