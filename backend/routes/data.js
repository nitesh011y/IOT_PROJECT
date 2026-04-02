const app = require("../utils/express_boiler.js");

const { getData } = require("./controler/data_controler.js");

app.get("/data", getData);
