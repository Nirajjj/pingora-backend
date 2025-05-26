const Chat = require("../models/chat");
const mongoose = require("mongoose");

async function accessChat(req, res) {
  try {
    const { userId } = req.body;
    const user = req.user;
    if (!userId) {
      return res
        .status(400)
        .send({ success: false, error: "userId param not send" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [user._id, userObjectId] },
    })
      .populate("users", "name")
      .populate("latestMessage");
    if (isChat) return res.status(200).json({ success: true, data: isChat });

    const chatData = new Chat({
      isGroupChat: false,
      users: [user._id, userObjectId],
    });
    const chatSave = await chatData.save();
    const completeChat = await Chat.findById(chatSave._id).populate(
      "users",
      "name age"
    );
    res.status(200).json({ success: true, data: completeChat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function fetchChats(req, res) {
  try {
    const user = req.user;
    console.log(user);
    const chats = await Chat.find({ users: { $elemMatch: { $eq: user._id } } })
      .populate("users", "name age")
      .populate("latestMessage")
      .populate("admin", "name")
      .sort({ updatedAt: -1 });
    res.status(200).send({ success: true, data: chats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    console.error(error);
  }
}

async function createGroupChat(req, res) {
  try {
    const loginUser = req.user;
    const { users, name } = req.body;

    if (!users || !name) {
      return res.status(400).json({
        success: false,
        message: "not get the necessary data to create groupe",
      });
    }
    // const groupUsersIdArray = JSON.parse(users);
    if (users.length <= 2) {
      return res.status(400).json({
        success: false,
        message: "group should have atleast 3 members ",
      });
    }
    users.push(loginUser._id);

    const group = await Chat.create({
      name,
      isGroupChat: true,
      users: users,
      admin: loginUser._id,
    });

    const GroupChat = await Chat.findById(group._id)
      .populate("users", "name")
      .populate("admin", "-password");
    res.status(200).json({ success: true, data: GroupChat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function renameGroup(req, res) {
  try {
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { accessChat, fetchChats, createGroupChat };
