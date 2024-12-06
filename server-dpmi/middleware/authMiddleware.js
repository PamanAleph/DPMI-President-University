const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      response: {
        status: "error",
        message: "Access denied, no token provided.",
      },
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      response: {
        status: "error",
        message: "Invalid or expired token.",
      },
      data: null,
    });
  }
};

module.exports = verifyToken;
