const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(400).send("Unauthorized access");
    }
    const decodeObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decodeObj;

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400).send("Unauthorized access");
    }
    res.user = user;
    next();
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
}

module.exports = authenticate;
