const axios = require("axios");
const Order = require("../model/ordermodel");
const Cart = require("../model/cartmodel");

const createOrderAndPay = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorised user" });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title price rating",
    });
    if (!cart || cart.length === 0) {
      return res.status(401).json({ msg: "Cart empty or not found" });
    }
    const totalAmount = cart.cart_total;
    const tx_ref = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      userId,
      cartId: cart._id,
      items: cart.items,
      totalAmount,
      tx_ref,
    });
    await order.save();

    const initiatePayment = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref,
        amount: totalAmount,
        currency: "NGN",
        redirect_url: "http://localhost:5001/api/order/verify",
        customer: {
          email: "ezebonnaedozie@gmail.com",
        },
        payment_options: "card,banktransfer,ussd",
        customizations: {
          title: "E-commerce Store Payment",
          description: "Payment for your order",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      msg: "Order created and payment initiated",
      checkout_url: initiatePayment.data.data.link,
      tx_ref,
      order,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: "Order creation/payment failed", error: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { transaction_id } = req.query;
    if (!transaction_id)
      return res.status(400).json({ msg: "Missing transaction_id" });

    const verifyRes = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const paymentData = verifyRes.data.data;
    const tx_ref = paymentData.tx_ref;

    if (paymentData.status === "successful") {
      const updatedOrder = await Order.findOneAndUpdate(
        { tx_ref },
        { paymentStatus: "paid", paymentData },
        { new: true }
      );
      return res.status(200).json({
        msg: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      return res.status(400).json({ msg: "Payment failed or not completed" });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ msg: "Payment verification error", error: err.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (signature !== secretHash) {
      return res.status(401).json({ msg: "Invalid webhook signature" });
    }

    const event = req.body;

    if (
      event.event === "charge.completed" &&
      event.data.status === "successful"
    ) {
      const tx_ref = event.data.tx_ref;

      await Order.findOneAndUpdate(
        { tx_ref },
        { paymentStatus: "paid", paymentData: event.data },
        { new: true }
      );
    }

    res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Webhook error", error: err.message });
  }
};

module.exports = { createOrderAndPay, verifyPayment, handleWebhook };
