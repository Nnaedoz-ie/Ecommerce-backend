const mongoose = require("mongoose");

const ordermodel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        total_price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    tx_ref: {
      type: String,
      unique: true,
    },
    paymentData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", ordermodel);
module.exports = Order;
