// const postModel = require("../model/post.model");
// const dotenv = require("dotenv");
// dotenv.config();
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

// const express = require("express");
// const app = express();

// app.use(cookieParser());

// const createPosts = async (req, res) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Please sign In" });
//     }
//     const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!verifyToken) {
//       return res.status(401).json({ message: "Please use valid Token" });
//     }
//     req.user = verifyToken;
//     for (let i = 1; i < 101; i++) {
//       const data = {
//         title: `post${i}`,
//         content: `Thid is post ${i}`,
//         attachment: `RANDOM`,
//         author: req.user.id,
//       };
//       await postModel.create(data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const postModel = require("../model/post.model");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = require("../db/db");

const createPosts = async () => {
  try {
    connectDb();
    const userId = "684f49cb915e823fb4e956d6"; // hardcode or fetch the user id you want to seed with
    for (let i = 1; i < 101; i++) {
      const data = {
        title: `post${i}`,
        content: `This is post ${i}`,
        attachment: `RANDOM`,
        author: userId,
      };
      await postModel.create(data);
    }
    console.log("100 posts created!");
  } catch (err) {
    console.log(err);
  }
};

createPosts();
