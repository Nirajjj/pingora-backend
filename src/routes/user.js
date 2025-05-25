const express = require("express");
const authenticate = require("../middleware/authenticate");
const app = express();

const userRouter = express.Router();

// userRouter.patch("/update", authenticate, updateUser);
