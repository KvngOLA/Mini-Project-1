const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to the database successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
