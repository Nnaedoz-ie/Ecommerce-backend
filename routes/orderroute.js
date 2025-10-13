const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyCustomer } = require("../verifyToken");

const {
  createOrderAndPay,
  verifyPayment,
  handleWebhook,
} = require("../controller/ordercontroller");

router.post("/create", verifyToken, createOrderAndPay);

// 💳 Verify payment (Flutterwave redirect or Postman test)
router.get("/verify", verifyPayment);

// 🔔 Handle Flutterwave Webhook
router.post("/webhook", handleWebhook);

module.exports = router;
