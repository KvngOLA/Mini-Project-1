const express = require("express");
const {
  getAllPost,
  createPost,
  getPostByTitle,
  editPost,
} = require("../controller/post.controller");
const authenticate = require("../auth.js/auth");
const router = express.Router();
const upload = require("../fileupload/multer");

router.get("/allPost", getAllPost);

router.post("/create", authenticate, upload.single("file"), createPost);

router.get("/get/:title", getPostByTitle);

router.post("/edit/:title", authenticate, upload.single("file"), editPost);

module.exports = router;
