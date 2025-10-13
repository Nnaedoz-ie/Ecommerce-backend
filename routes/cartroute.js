const express = require("express");
const router = express.Router();
const {
  createCart,
  addToCart,
  getAllCarts,
} = require("../controller/cartController");
const { verifyAdmin, verifyCustomer } = require("../verifyToken");

router.post("/createcart", verifyCustomer, createCart);
router.post("/addtocart", verifyCustomer, addToCart);
router.get("/getallcarts", verifyAdmin, getAllCarts);

module.exports = router;
