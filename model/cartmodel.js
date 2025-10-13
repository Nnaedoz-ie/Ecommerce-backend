const mongoose = require("mongoose");

const cartmodel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        total_price: {
          type: Number,
        },
      },
    ],
    cart_total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartmodel);
module.exports = Cart;
