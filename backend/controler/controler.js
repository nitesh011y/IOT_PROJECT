const { writeApi, Point } = require("../config/influx");

const getData = function (req, res) {
  try {
    const { deviceId, distance, water, sos } = req.query;

    if (!deviceId) {
      return res.status(400).json({ success: false });
    }

    //push to db
    const point = new Point("smart_cane")
      .tag("deviceId", deviceId)
      .floatField("distance", Number(distance))
      .intField("water", Number(water))
      .booleanField("sos", sos === "1");

    writeApi.writePoint(point);

    res.status(200).json({
      success: true,
      message: "Data stored in InfluxDB",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

module.exports = { getData };
