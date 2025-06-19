const express = require("express");
const router = express.Router();
const upload = require("../fileupload/multer");
const authenticate = require("../auth.js/auth");

const {
  getHomePage,
  createUser,
  login,
  verify,
} = require("../controller/user.controller");

router.get("/", getHomePage);

router.post("/signup", upload.single("file"), createUser);

router.post("/login", login);

router.post("/verify", authenticate, verify);
module.exports = router;
