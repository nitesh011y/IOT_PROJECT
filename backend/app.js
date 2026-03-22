const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectMongo = require("./config/mongo_db.js");
connectMongo();
const cors = require("cors");
cors("*");

//for always service up
const interval = 300000;
function reloadWebsite() {
  axios
    .get(url)
    .then(() => console.log("Website pinged to prevent sleep"))
    .catch((err) => console.log(" Auto-ping error:", err.message));
}
setInterval(reloadWebsite, interval);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get routes
const { getData } = require("./controler/controler.js");

app.get("/data", getData);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running ....");
});
