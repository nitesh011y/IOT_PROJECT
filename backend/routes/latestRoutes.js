const express = require("express");
const router = express.Router();

// controller
const { getLatestData } = require("../controler/data_controler");
// route → latest 10 records
router.get("/latest", getLatestData);

module.exports = router; 