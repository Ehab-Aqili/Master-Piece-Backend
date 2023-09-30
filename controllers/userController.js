import Model from "../models/userModel.js";
import jwt from "jsonwebtoken";
import util from "util";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const { User, Recipes } = Model;
const test = async (req, res) => {
  console.log(req.body);
  res.send("test");
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const createUser = async (req, res) => {
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
        calories: null,
        role: req.body.role,
        date_birth: null,
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
          date_birth: user.date_birth,
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

const login = async (req, res) => {
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
          date_birth: emailAndPassExists.date_birth,
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

const update = async (req, res) => {
  try {
    const { id, username, calories, date_birth } = req.body;
    await User.findByIdAndUpdate(
      id,
      {
        username,
        date_birth,
        calories,
      },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const favorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    await User.updateOne(
      { _id: userId },
      {
        $push: { favorite: recipeId },
      }
    );
    res.status(200).json({
      message: "Add recipe to favorite successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    await User.updateOne(
      { _id: userId },
      {
        $pull: { favorite: recipeId },
      }
    );
    res.status(200).json({
      message: "remove recipe from favorite successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const userFavoriteIds = user.favorite.map((item) => item);
    console.log(userFavoriteIds);
    const userFavorite = await Recipes.find({ _id: { $in: userFavoriteIds } });
    res.status(200).json({
      data: {
        userFavorite,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const addMeal = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    await User.updateOne(
      { _id: userId },
      {
        $push: { meals: recipeId },
      }
    );
    res.status(200).json({
      message: "Add recipe to meals successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const removeMeal = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    await User.updateOne(
      { _id: userId },
      {
        $pull: { meals: recipeId },
      }
    );
    res.status(200).json({
      message: "remove recipe from meals successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const getMeals = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const userMealIds = user.meals.map((item) => item);
    console.log(userMealIds);
    const userMeals = await Recipes.find({ _id: { $in: userMealIds } });
    res.status(200).json({
      data: {
        userMeals,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const protect = async (req, res, next) => {
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

export default {
  test,
  createUser,
  login,
  update,
  favorite,
  removeFavorite,
  getFavorite,
  addMeal,
  removeMeal,
  getMeals,
  protect,
};
