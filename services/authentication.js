require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = authenticateToken = (req, res, next) => {
  const rawJwtToken = req.header("Authorization");

  if (!rawJwtToken || !rawJwtToken.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const jwtToken = rawJwtToken.split(" ")[1];
  if (!jwtToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(jwtToken, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
};
