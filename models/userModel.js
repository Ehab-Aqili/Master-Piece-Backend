const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

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
  favorite: [String],
  meals: [String],
  calories: {
    type: Number,
    min: 0,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
  token: String,
});

userSchema.methods.comPass = async (pass, passDB) => {
  return await bcrypt.compare(pass, passDB);
};

const User = mongoose.model("User", userSchema, "users");

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Users Collection connected");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
module.exports = User;
