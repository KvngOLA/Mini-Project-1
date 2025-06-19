const express = require("express");
const router = express.Router();
const authenticate = require("../auth.js/auth");
const ifAdmin = require("../auth.js/AdminCheck");
const { updatePost, admiinLogin } = require("../controller/admin.controller");
const upload = require("../fileupload/multer");

router.post("/adminLogin", admiinLogin);

router.post(
  "/edit/:title",
  authenticate,
  ifAdmin,
  upload.single("file"),
  updatePost
);

module.exports = router;
