const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
} = require("../controllers/chatController");
const authenticate = require("../middleware/authenticate");
const chatRouter = express.Router();

chatRouter.post("/chat", authenticate, accessChat);
chatRouter.get("/chat", authenticate, fetchChats);
chatRouter.post("/chat/Group/create", authenticate, createGroupChat);

module.exports = chatRouter;
