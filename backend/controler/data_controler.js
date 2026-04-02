const IoTEvent = require("../models/IoTEvent");

// Get latest 10 records
const getLatestData = async (req, res) => {
  try {

    const latestData = await IoTEvent
      .find()
      .sort({ _id: -1 })   // newest first
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Latest 10 records fetched",
      data: latestData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = { getLatestData };