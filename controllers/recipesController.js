const {  Recipes } = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });


exports.test = async (req, res) => {
    console.log(req.body);
    res.send("test");
  };