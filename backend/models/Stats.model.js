const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema(
  {
    obstacle: {
      type: String,
      enum: ["FAR", "MEDIUM", "NEAR"],
      required: false,
    },
    water: {
      type: String,
      enum: ["DETECTED", "NOT_DETECTED"],
      required: false,
    },
    sos: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stats", StatsSchema);
