// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId will now be accessible as req.user.id
    next();
  } catch (err) {
    console.error(
      "JWT verification failed:",
      process.env.JWT_SECRET,
      err.message
    );
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
