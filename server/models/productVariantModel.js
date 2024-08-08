const { default: mongoose } = require("mongoose");

const attributeSchema = new mongoose.Schema({
  key: {
    type: String,
    enum: ["Flavor", "Size", "Weight", "Volume", "Color", "salePackaging"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productVariantSchema = new mongoose.Schema(
  {
    variantName: {
      type: String,
      required: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    attributes: {
      type: [attributeSchema],
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
