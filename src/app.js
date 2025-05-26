const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require("./config/db");
const authRouter = require("./routes/authentication");
const chatRouter = require("./routes/chat");
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
require("dotenv").config();
app.use(cookieParser());

app.use(express.json());

app.use("/", authRouter);
app.use("/", chatRouter);

(async function startServer() {
  try {
    const port = process.env.PORT;
    await dbConnect();
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("get error while starting server :" + error);
    process.exit(1);
  }
})();
