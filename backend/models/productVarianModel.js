const { default: mongoose } = require("mongoose");

const attributeSchema = new mongoose.Schema({
  key: {
    type: String,
    enum: ["Flavor", "Size", "Weight", "Volume", "Color", "packagingType"],
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
    price: {
      type: Number,
      required: true,
    },
    attributes: [],
    stock: {
      type: Number,
      required: true,
    },
  },
  { timeStamps: true }
);
