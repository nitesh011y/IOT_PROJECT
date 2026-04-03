const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    obstacle: String,
    water: String,
    sos: Boolean,
    userStatus: String,
    deviceStatus: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stats", statsSchema);
