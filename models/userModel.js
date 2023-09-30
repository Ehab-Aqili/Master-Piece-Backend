import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipes",
    },
  ],
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipes",
    },
  ],
  calories: {
    type: Number,
    min: 0,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
  date_birth: String,
  token: String,
});
const recipes = new mongoose.Schema({
  recipe_calories: Number,
  recipe_Name: String,
  recipe_Categories: String,
  recipe_image: String,
});

userSchema.methods.comPass = async (pass, passDB) => {
  return await bcrypt.compare(pass, passDB);
};

const User = mongoose.model("User", userSchema, "users");
const Recipes = mongoose.model("Recipes", recipes, "recipes");
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
export default {User, Recipes} ;
