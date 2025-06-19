const bcrypt = require("bcrypt");
const Joi = require("joi");
const generateToken = require("../token/token");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary/cloudinray");
const upload = require("../fileupload/multer");
const emitter = require("../mailer/mailer");
const newToken = require("../utils/generateToken");
const UserService = require("../services/user.service");
const OtpService = require("../services/otp.service");

const getHomePage = (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Welcome to the home page of my code revival" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    if (!email.includes("@")) {
      return res.status(409).json({ message: "Please enter a valid mail" });
    }
    const userExists = await UserService.findOne(email);
    if (userExists) {
      return res.status(409).json({ message: "This user already exists" });
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$'
          )
        )
        .required(),
      userRole: Joi.string(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(401).json({ message: result.error.message });
    }

    const otpPromise = generateToken();
    const author = email;
    const otp = (await otpPromise).toString();

    const otpData = {
      author,
      otp: await bcrypt.hash(otp, 10),
    };

    const newOtp = await OtpService.create(otpData);

    const options = {
      email: req.body.email,
      subject: "Please input your OTP to continue signup process",
      message: `
      <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Signup Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #fff;
                padding: 20px;
                border: 1px solid #ddd;
            }
            h1 {
                color: #333;
                font-size: 24px;
            }
            p {
                color: #666;
                font-size: 16px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 4px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Our Platform!</h1>
            <p>Hello Friend</p>
            <p>Thank you for signing up. Please click the button below to confirm your email address and complete your registration:</p>
            <p> Your OTP is ${otp}</p>
            <p>If you didn’t sign up for this account, please ignore this email.</p>
            <div class="footer">
                <p>© 2025 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
      `,
    };
    emitter.emit("send-mail", options);

    const userData = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      profilePicture: upload.secure_url,
      userRole,
    };

    const newUser = await UserService.create(userData);

    res.status(200).json({
      message: "Thsi user has been created successfully",
      notice:
        "Please input the otp sent to your mail to complete the verification process",
      message2: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(409)
        .json({ message: "Please fill all required fields" });
    }
    const userExists = await UserService.findOne(email);
    if (!userExists) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const correctPassword = await bcrypt.compare(password, userExists.password);
    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
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

const verify = async (req, res) => {
  try {
    const otp = req.body.otp;
    const tokenOwner = req.user.email;

    const userOtp = await OtpService.findOne(tokenOwner);

    if (!userOtp) {
      return res.status(401).json({ message: "Otp expired" });
    }
    const verifyOtp = await bcrypt.compare(otp, userOtp.otp);
    if (!verifyOtp) {
      return res.status(401).json({ message: "Invalid Otp" });
    }

    const data = {
      verified: true,
    };

    const updatedUser = await UserService.update(tokenOwner, data);

    res.status(200).json({ message: "User Verified", message2: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = {
  getHomePage,
  createUser,
  login,
  verify,
};
