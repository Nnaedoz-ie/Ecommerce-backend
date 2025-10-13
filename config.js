const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.URL)
    .then(() => {
      console.log("Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectDB };
