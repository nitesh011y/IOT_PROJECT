const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectMongo = require("./config/mongo_db.js");
connectMongo();
const cors = require("cors");
cors("*");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get routes
const { getData } = require("./controler/controler.js");

app.get("/data", getData);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running ....");
});
