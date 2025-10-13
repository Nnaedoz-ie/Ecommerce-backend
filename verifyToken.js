const Admin = require("./model/adminmodel");
const Customer = require("./model/customermodel");
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  // const token = req.headers.cookie.split("=")[1]; // Attempt to get the token from cookies

  const cookieHeader = req.headers.cookie;
  let token = null;
  let tokenType = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((each) => each.trim());

    // Try to find admin_token or access_token
    const adminCookie = cookies.find((c) => c.startsWith("admin_token="));
    const customerCookie = cookies.find((c) => c.startsWith("access_token="));
    if (adminCookie) {
      token = adminCookie.split("=")[1];
      tokenType = "admin";
    } else if (customerCookie) {
      token = customerCookie.split("=")[1];
      tokenType = "customer";
    }
  }
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." }); // No token found
  }

  try {
    // Verify the token using the same secret key used during signing
    // The 'secret' should be stored securely, e.g., in environment variables
    const decoded = jwt.verify(token, process.env.JWT); // Replace 'secret' with your actual secret key
    // console.log(decoded);

    // Add the decoded payload (which includes user ID) to the request object
    // This makes user information available to subsequent route handlers
    req.user = decoded;
    req.tokenType = tokenType;

    process.nextTick(() => {
      console.log({
        user: req.user,
        tokenType: req.tokenType,
        body: req.body,
      });
    });
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    // Token is invalid (e.g., expired, tampered)
    return res.status(403).json({ message: "Invalid Token." });
  }
};

const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      //  If token type is not admin, reject immediately
      if (req.tokenType !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }

      next();
    } catch (error) {
      console.error("Admin verification error:", error);
      return res.status(500).json({ message: "Server error verifying admin." });
    }
  });
};

const verifyCustomer = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      //  If token type is not customer, reject immediately
      if (req.tokenType !== "customer") {
        return res
          .status(403)
          .json({ message: "Access denied. Customers only." });
      }
      const customer = await Customer.findById(req.user.id);

      if (!customer) {
        return res
          .status(403)
          .json({ message: "Access denied. Customers only." });
      }

      next();
    } catch (error) {
      console.error("Admin verification error:", error);
      return res
        .status(500)
        .json({ message: "Server error verifying Customer." });
    }
  });
};

module.exports = { verifyToken, verifyAdmin, verifyCustomer };
