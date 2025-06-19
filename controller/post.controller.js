const cloudinary = require("../cloudinary/cloudinray");
const postModel = require("../model/post.model");
const userModel = require("../model/user.model");
const PostService = require("../services/post.service");

const getAllPost = async (req, res) => {
  const pageSize = req.query.limit || 10;
  const page = Number(req.query.page) || 1;
  const count = await PostService.estimatedDocumentCount();

  try {
    const allPost = await PostService.findMany()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({
      message: allPost,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file.path;
    const authorId = req.user.id;
    const upload = await cloudinary.v2.uploader.upload(file);

    if (!title || !content) {
      return res
        .status(401)
        .json({ message: "Please fill all required fields" });
    }

    const postExists = await PostService.findOne(title);
    if (postExists) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists" });
    }

    const data = {
      title,
      content,
      attachment: upload.secure_url,
      author: authorId,
    };

    const newPost = await PostService.create(data);

    return res.status(200).json({ message: newPost });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const getPostByTitle = async (req, res) => {
  try {
    const title = req.params.title;

    const postExists = await PostService.findOne(title);
    if (!postExists) {
      return res.status(409).json({
        message: "This post does not exist, Please enter a valid post title",
      });
    }

    return res.status(200).json({ message: postExists });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const editPost = async (req, res) => {
  try {
    const title = req.params.title;
    const content = req.body.content;
    const userId = req.user.id;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    const postExists = await PostService.findOne(title);

    if (!postExists) {
      return res.status(409).json({
        message: "This post does not exist, Please enter a valid post title",
      });
    }
    const authorId = postExists.author;

    if (userId != authorId) {
      return res
        .status(401)
        .json({ message: "You are not authorized to edit this post" });
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
  getAllPost,
  createPost,
  getPostByTitle,
  editPost,
};
