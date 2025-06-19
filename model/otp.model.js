const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  author: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 600,
  },
});

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;
