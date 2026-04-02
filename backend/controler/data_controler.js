// const { writeApi, Point } = require("../config/influx");
const IoTEvent = require("../models/IoTEvent");

const getData = async (req, res) => {
  try {
    let getDB_data = await IoTEvent.find();

    res.status(200).json({
      success: true,
      message: "Data fetch successfully",
      data: getDB_data,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false });
  }
};

module.exports = { getData };
