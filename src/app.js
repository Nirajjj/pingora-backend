const express = require("express");
const dbConnect = require("./config/db");
const authRouter = require("./routes/authentication");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/", authRouter);
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
