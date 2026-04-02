const express = require("express");
require("./utils/mqtt/subscriber.js"); // start MQTT listener
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectMongo = require("./config/mongo_db.js");
connectMongo();
const cors = require("cors");
cors("*");
const axios = require("axios");

// const url = "http://localhost:3000";
// //for always service up
// const interval = 300000;
// function reloadWebsite() {
//   axios
//     .get(url)
//     .then(() => console.log("Website pinged to prevent sleep"))
//     .catch((err) => console.log(" Auto-ping error:", err.message));
// }
// setInterval(reloadWebsite, interval);

//cookie setup
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Parse incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mount routes
app.use("/api/auth", require("./routes/Auth.js"));

//get data routs
const { getData } = require("./controler/data_controler.js");

app.get("/data", getData);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running ....");
});
