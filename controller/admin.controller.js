const cloudinary = require("../cloudinary/cloudinray");
const bcrypt = require("bcrypt");
const newToken = require("../utils/generateToken");
const UserService = require("../services/user.service");
const PostService = require("../services/post.service");

const admiinLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(409)
        .json({ message: "Please fill all required fields" });
    }

    const userExists = await UserService.findOne(email);

    if (!userExists)
      return res.status(401).json({ message: "Invalid credentials" });

    const correctPassword = await bcrypt.compare(password, userExists.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (userExists.userRole != "admin") {
      return res
        .status(409)
        .json({ message: "This end point is only for admins" });
    }
    const payload = { id: userExists._id, email: userExists.email };

    const token = newToken(payload);

    res.cookie("token", token, { maxAge: 900000, httpOnly: true });

    res.status(200).json({
      message: "Logged in successfully",
      message2: `Welcome ${userExists.name}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const title = req.params.title;
    const content = req.body.content;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    const postExists = PostService.findOne(title);
    if (!postExists) {
      return res.status(409).json({
        message: "This post does not exist, Please enter a valid post title",
      });
    }

    const data = {
      content,
      attachment: upload.secure_url,
    };

    const updatedPost = await PostService.update(title, data);

    res.status(200).json({ message: updatedPost });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = {
  updatePost,
  admiinLogin,
};
