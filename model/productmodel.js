const mongoose = require("mongoose");

const productmodel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockcount: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "out-of-stock", "discontinued"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productmodel);
module.exports = Product;
