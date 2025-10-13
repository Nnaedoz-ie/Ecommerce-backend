const Customer = require("../model/customermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { firstname, lastname, email, phone, address, password, age } =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !address ||
    !password ||
    !age
  ) {
    return res.status(400).json({ msg: "fill in all fields!" });
  }
  try {
    const theemail = await Customer.findOne({ email: email });
    if (theemail) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const customer = new Customer({
      firstname,
      lastname,
      phone,
      address,
      email,
      password: hashedpassword,
      age,
    });
    await customer.save();
    return res.status(201).json({ msg: "Customer created successfully" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "input all fields" });
    }
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ msg: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Email or password incorrect" });
    }
    const token = jwt.sign({ id: customer._id }, process.env.JWT);
    res.cookie("access_token", token, {
      httpOnly: true,
      path: "/",
    });
    res.status(200).json({ msg: "signed in successfully" });
    console.log(req);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const totalCustomers = async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.status(200).json({ total_customers: count });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = { signup, signin, totalCustomers };
