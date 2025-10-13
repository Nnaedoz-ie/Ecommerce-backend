const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");

const createCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      return res.status(400).json({
        message: "Cart already exists for this user",
        cart: existingCart,
      });
    }

    const newCart = new Cart({
      userId: userId,
      items: [], // Empty items array initially
      cart_total: 0,
    });

    await newCart.save();

    res.status(201).json({
      msg: "Cart created successfully",
      cart: newCart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], cart_total: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const existingProduct = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += Number(quantity);
      existingProduct.total_price = existingProduct.quantity * product.price;
    } else {
      const qty = Number(quantity);
      const total_price = product.price * qty;
      cart.items.push({ productId, quantity: qty, total_price });
    }

    cart.cart_total = cart.items.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    await cart.save();
    const populatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price rating status",
    });
    return res
      .status(201)
      .json({ msg: "Added to cart successfully", cart: populatedCart });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate({
        path: "items.productId",
        select: "title price rating status",
      })
      .populate({
        path: "userId",
        select: "name email",
      });

    if (!carts || carts.length === 0) {
      return res.status(400).json({ msg: "No carts found" });
    }
    return res.status(200).json({
      msg: `Fetched successfully, and total of ${carts.length} carts`,
      carts,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = { createCart, addToCart, getAllCarts };
