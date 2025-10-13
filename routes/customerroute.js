const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  totalCustomers,
} = require("../controller/customercontroller");
const { verifyToken, verifyAdmin, verifyCustomer } = require("../verifyToken");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/totalcustomers", verifyAdmin, totalCustomers);

module.exports = router;
