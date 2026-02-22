const express = require("express");
const app = express();
const getData = function (req, res) {
  try {
    const data = req.query;

    if (data == undefined) {
      return res
        .status(200)
        .json({ success: false, message: "data not found" });
    }
    console.log(data);
    res
      .status(200)
      .json({ success: true, message: "data reched ..", data: data });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getData };
