const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3000;
const userRoute = require("./routes/userRoute");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("home");
});

app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
