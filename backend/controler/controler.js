// // const { writeApi, Point } = require("../config/influx");
// const IoTEvent = require("../models/IoTEvent");

// const getData = async (req, res) => {
//   try {
//     // Merge ALL incoming dataSS
//     // const incomingData = {
//     //   ...req.query,
//     //   ...req.body,
//     // };

//     // const deviceId = incomingData.deviceId || "UNKNOWN_DEVICE";

//     // /* -------- InfluxDB (Only numeric/time-series) -------- */
//     // if (incomingData.distance || incomingData.water || incomingData.sos) {
//     //   const point = new Point("smart_cane").tag("deviceId", deviceId);

//     //   if (incomingData.distance !== undefined)
//     //     point.floatField("distance", Number(incomingData.distance));

//     //   if (incomingData.water !== undefined)
//     //     point.intField("water", Number(incomingData.water));

//     //   if (incomingData.sos !== undefined)
//     //     point.booleanField(
//     //       "sos",
//     //       incomingData.sos === "1" || incomingData.sos === true,
//     //     );

//     //   writeApi.writePoint(point);
//     // }

//     /* -------- MongoDB (RAW DATA STORAGE) -------- */
//     // await IoTEvent.create({
//     //   deviceId,
//     //   payload: incomingData,
//     //   source: "http-iot",
//     // });

//     let getDB_data = await IoTEvent.find();

//     res.status(200).json({
//       success: true,
//       message: "Data stored in mongo",
//       data: getDB_data,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ success: false });
//   }
// };

// module.exports = { getData };
