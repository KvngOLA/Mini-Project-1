const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
    },
    password: { type: String },
    userRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
