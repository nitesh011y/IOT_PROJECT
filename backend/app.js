const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const http = require("http");
const server = http.createServer(app);

const cors = require("cors");
app.use(cors("*"));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectMongo = require("./config/mongo_db.js");
connectMongo();

//  INIT SOCKET.IO
const { initSocket } = require("./socket/index.js");
initSocket(server);

//  START MQTT AFTER SOCKET INIT
require("./utils/mqtt/subscriber.js");

// Routes
app.use("/api/auth", require("./routes/Auth.js"));

const { getData } = require("./controler/data_controler.js");
app.get("/data", getData);

// Start server
server.listen(process.env.PORT || 3000, () => {
  console.log("Server running ....");
});
