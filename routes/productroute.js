const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  totalProducts,
} = require("../controller/productcontroller");
const { verifyToken } = require("../verifyToken");
const { verifyAdmin } = require("../verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/", verifyToken, upload.single("image"), createProduct);
router.get("/getproducts", getProducts);
router.get("/getproduct/:title", getProduct);
router.get("/getproductbyslug/:slug", getProductBySlug);
router.get("/totalproducts/", verifyAdmin, totalProducts);

module.exports = router;
