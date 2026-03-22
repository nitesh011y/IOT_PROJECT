const mongoose = require("mongoose");

const IoTEventSchema = new mongoose.Schema(
  {
    deviceId: { type: String, index: true },

    // Store EVERYTHING here
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },

    source: {
      type: String,
      default: "iot-device",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }, // <-- VERY IMPORTANT
);

module.exports = mongoose.model("IoTEvent", IoTEventSchema);
