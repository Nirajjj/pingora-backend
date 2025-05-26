const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 120,
      trim: true,
    },
    age: {
      type: Number,
      minLength: 1,
      maxLength: 3,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  try {
    const user = this;
    const isPasswordCorrect = await bcrypt.compare(
      userInputPassword,
      user.password
    );
    return isPasswordCorrect;
  } catch (error) {
    console.error("get error while validating password" + error);
  }
};
const User = mongoose.model("User", userSchema);

module.exports = User;
