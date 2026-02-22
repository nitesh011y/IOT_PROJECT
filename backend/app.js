const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
cors("*");

//middleware
app.use(express.json);

//get routes
const { getData } = require("./controler/controler.js");

app.get("/data", getData);

app.listen(process.env.PORT, () => {
  console.log("Server running on port");
});
