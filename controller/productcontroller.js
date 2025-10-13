const Product = require("../model/productmodel");

const createProduct = async (req, res) => {
  console.log(req.file);
  try {
    const { title, price, stockcount, image, description, rating, status } =
      req.body;

    if (!title || !price) {
      return res.status(400).json({ msg: "Please fill in all fields!" });
    }

    const slug = title.split(" ").join("-").toLowerCase();
    const theimage = req.file ? req.file.filename : null;
    const thetitle = await Product.findOne({ title: title });
    if (thetitle) {
      return res.status(400).json({ msg: "Product already exists" });
    }

    const product = new Product({
      title,
      price,
      description,
      image: theimage,
      rating,
      status,
      stockcount,
      slug: slug,
    });
    await product.save();
    return res.status(201).json({ msg: "Product created successfully" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getProduct = async (req, res) => {
  const title = req.params.title;
  try {
    const products = await Product.findOne({ title });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const products = await Product.findOne({ slug });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const totalProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ total: count });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  totalProducts,
};
