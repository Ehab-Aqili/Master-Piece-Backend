const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

exports.test = async (req, res) => {
  console.log(req.body);
  res.send("test");
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.createUser = async (req, res) => {
  const key = req.body.admin_key;
  const role = req.body.role;
  console.log(req);
  // console.log(key);
  try {
    if (
      (role === "admin" && key === process.env.ADMIN_KEY) ||
      role === "user"
    ) {
      const alreadyExistUser = await User.findOne({ email: req.body.email });
      if (alreadyExistUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const token = createToken(User._id);
      const encryptPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: encryptPassword,
        favorite: [],
        meals: [],
        calories: 0,
        role: req.body.role,
        token,
      });
      const message = "Thanks for Registering";

      res.status(201).json({
        data: {
          username: user.username,
          email: user.email,
          favorite: user.favorite,
          meals: user.meals,
          calories: user.calories,
          token: user.token,
        },
        message: { message },
      });
    } else {
      res.status(400).json({ message: "Wrong Secret Key" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const emailAndPassExists = await User.findOne({
      email: req.body.email,
    });

    if (!emailAndPassExists) {
      return res.status(409).json({ message: "Not Match Email or Password" });
    } else {
      const matchPass = await emailAndPassExists.comPass(
        req.body.password,
        emailAndPassExists.password
      );
      if (matchPass) {
        // console.log(emailAndPassExists._id);
        const token = createToken(emailAndPassExists._id);
        res.status(201).json({
          token,
          userId: emailAndPassExists._id,
          role: emailAndPassExists.role,
          username: emailAndPassExists.username,
          email: emailAndPassExists.email,
          favorite: emailAndPassExists.favorite,
          meals: emailAndPassExists.meals,
          calories: emailAndPassExists.calories,
        });
        // console.log("Login Successfull");
      } else {
        res.status(409).json({ message: "Not Match Email or Password" });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith("bearer")) {
      token = testToken.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        message: "You are not Login",
      });
    }
    await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
