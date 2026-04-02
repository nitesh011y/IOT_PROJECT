const IoTEvent = require("../models/IoTEvent");
const fs = require("fs");
const fastcsv = require("fast-csv");

const extractActivity = (payload) => {
  if (!payload) return "Unknown Event";

  let msg = "";

  // Get the string message from payload
  if (typeof payload === "string") msg = payload;
  else if (payload.payload && typeof payload.payload === "string")
    msg = payload.payload;
  else if (payload.message && typeof payload.message === "string")
    msg = payload.message;
  else {
    // fallback: join all string values
    msg = Object.values(payload)
      .filter((v) => typeof v === "string")
      .join(" | ");
  }

  // Remove the unwanted prefix
  msg = msg.replace(/^smartcane\/data\s*/i, ""); // remove "smartcane/data" at start
  msg = msg.replace(/\|/g, " ").trim();
  return msg || "Unknown Event";
};
// GET: Fetch history with filters
const filter_data = async (req, res) => {
  try {
    const { type, from, to, limit } = req.query;

    let query = {};

    if (type && type !== "ALL") {
      query["payload.payload"] = new RegExp(type, "i");
    }

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const displayLimit = parseInt(limit) || 50;

    const events = await IoTEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(displayLimit);

    const formattedEvents = events.map((e) => ({
      ...e._doc,
      activity: e.activity || extractActivity(e.payload),
    }));

    res.json(formattedEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: Export CSV

const export_csv = async (req, res) => {
  try {
    const { from, to, limit = 1000 } = req.query;
    let query = {};
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const events = await IoTEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=smart_cane-history.csv",
    );

    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(res);

    events.forEach((e) => {
      csvStream.write({
        timestamp: e.timestamp.toISOString(),
        event: extractActivity(e.payload),
        topic: e.payload?.topic || "",
        source: e.source || "",
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { export_csv, filter_data };
