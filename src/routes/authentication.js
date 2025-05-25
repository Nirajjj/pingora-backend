const express = require("express");
const User = require("../models/user");
const {
  signup,
  login,
  logout,
} = require("../controllers/authenticateController");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = authRouter;
