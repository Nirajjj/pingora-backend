const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connection successful");
  } catch (error) {
    console.error("db connection issue :" + error.message);
    process.exit(1);
  }
}

module.exports = dbConnect;
