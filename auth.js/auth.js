const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Please sign In" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).json({ message: "Please use valid Token" });
    }
    req.user = verifyToken;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = authenticate;
