const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  attachment: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "userModel",
  },
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
