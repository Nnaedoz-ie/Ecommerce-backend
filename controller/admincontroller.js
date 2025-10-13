const Admin = require("../model/adminmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, address, password } = req.body;
    if (!firstname || !lastname || !email || !phone || !address || !password) {
      return res.status(400).json({ msg: "Please fill in all fields!" });
    }
    const doesAdminExist = await Admin.findOne();
    if (doesAdminExist) {
      return res.status(200).json({ msg: "An admin already exists" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      firstname,
      lastname,
      phone,
      address,
      email,
      password: hashedpassword,
    });
    await admin.save();
    return res.status(201).json({
      msg: "Admin signed up successfully. You will be the only admin",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const signin = async (req, res) => {
  try {
    // console.log(req);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields!" });
    }
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ msg: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT);
    res.cookie("admin_token", token, {
      httpOnly: true,
      path: "/",
    });
    return res.status(200).json({ msg: "Signed in successfully" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = { signup, signin };
