const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.get("/", (req, res) => {
  console.log("hello");
  return "hellos";
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port");
});
