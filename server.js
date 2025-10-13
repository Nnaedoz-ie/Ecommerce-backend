const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
app.use(express.json());
const port = process.env.PORT;
const customerroute = require("./routes/customerroute");
const adminroute = require("./routes/adminroute");
const productroute = require("./routes/productroute");
const cartroute = require("./routes/cartroute");
const orderroute = require("./routes/orderroute");
const { connectDB } = require("./config");
connectDB();

app.use("/api/customer", customerroute);
app.use("/api/admin", adminroute);
app.use("/api/product", productroute);
app.use("/api/cart", cartroute);
app.use("/api/order", orderroute);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
