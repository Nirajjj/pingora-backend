const User = require("../models/user");
const bcrypt = require("bcrypt");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exist");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    const userData = await user.save();
    const token = user.getJWT();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    console.error("get error in signup: " + error);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credential");
    }

    const isPasswordValidate = await user.validatePassword(password);
    console.log(isPasswordValidate);
    if (!isPasswordValidate) {
      throw new Error("invalid credential");
    }
    const token = user.getJWT();
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    console.error("get error in login: " + error);
  }
}

function logout(req, res) {
  res.clearCookie("token", { secure: "true", sameSite: "strict" });
  res.json({ success: true, message: "logout successful!" });
}
module.exports = { signup, login, logout };
