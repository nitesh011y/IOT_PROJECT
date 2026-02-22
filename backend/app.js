const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.get("/data", (req, res) => {
  console.log("hello");
  return res.json("dont");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port");
});
