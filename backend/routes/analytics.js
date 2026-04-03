const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats.model");

// Helper to extract distance from obstacle string using regex (used in some routes)
function getDistance(obstacleStr) {
  if (!obstacleStr) return null;
  if (/FAR/i.test(obstacleStr)) return "FAR";
  if (/MEDIUM/i.test(obstacleStr)) return "MEDIUM";
  if (/VERY CLOSE/i.test(obstacleStr)) return "VERY CLOSE";
  return null;
}

// ----------------------------------------------------------------------
// 1. Overview KPIs – total counts and current status
// ----------------------------------------------------------------------
router.get("/overview", async (req, res) => {
  try {
    const [totalDocs, obstacleEvents, waterEvents, sosEvents, latest] =
      await Promise.all([
        Stats.countDocuments(),
        Stats.countDocuments({ obstacle: { $ne: null, $ne: "" } }),
        Stats.countDocuments({ water: { $regex: /detected/i } }),
        Stats.countDocuments({ sos: true }),
        Stats.findOne().sort({ createdAt: -1 }),
      ]);

    // Breakdown by obstacle distance using $regex instead of $function
    const obstacleDistances = await Stats.aggregate([
      { $match: { obstacle: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: { $regexMatch: { input: "$obstacle", regex: /FAR/i } },
                  then: "FAR",
                },
                {
                  case: {
                    $regexMatch: { input: "$obstacle", regex: /MEDIUM/i },
                  },
                  then: "MEDIUM",
                },
                {
                  case: {
                    $regexMatch: { input: "$obstacle", regex: /VERY CLOSE/i },
                  },
                  then: "VERY CLOSE",
                },
              ],
              default: "OTHER",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalEvents: totalDocs,
      totalObstacles: obstacleEvents,
      totalWater: waterEvents,
      totalSOS: sosEvents,
      obstacleBreakdown: obstacleDistances,
      latestEvent: latest,
      currentUserStatus: latest?.userStatus || "unknown",
      currentDeviceStatus: latest?.deviceStatus || "unknown",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 2. Time‑series data for charts (line/bar chart)
// ----------------------------------------------------------------------
router.get("/timeline", async (req, res) => {
  try {
    const { interval = "hour", start, end } = req.query;
    const startDate = start
      ? new Date(start)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = end ? new Date(end) : new Date();

    let groupFormat;
    switch (interval) {
      case "minute":
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" },
        };
        break;
      case "hour":
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" },
        };
        break;
      case "day":
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        break;
      default:
        groupFormat = {
          $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" },
        };
    }

    const pipeline = [
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: groupFormat,
          totalEvents: { $sum: 1 },
          obstacles: { $sum: { $cond: [{ $ne: ["$obstacle", null] }, 1, 0] } },
          water: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$water", regex: /detected/i } },
                1,
                0,
              ],
            },
          },
          sos: { $sum: { $cond: ["$sos", 1, 0] } },
          veryClose: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$obstacle", regex: /VERY CLOSE/i } },
                1,
                0,
              ],
            },
          },
          medium: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$obstacle", regex: /MEDIUM/i } },
                1,
                0,
              ],
            },
          },
          far: {
            $sum: {
              $cond: [
                { $regexMatch: { input: "$obstacle", regex: /FAR/i } },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result = await Stats.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 3. Obstacle distance breakdown (simple pie chart data)
// ----------------------------------------------------------------------
router.get("/obstacle-breakdown", async (req, res) => {
  try {
    const breakdown = await Stats.aggregate([
      { $match: { obstacle: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: { $regexMatch: { input: "$obstacle", regex: /FAR/i } },
                  then: "FAR",
                },
                {
                  case: {
                    $regexMatch: { input: "$obstacle", regex: /MEDIUM/i },
                  },
                  then: "MEDIUM",
                },
                {
                  case: {
                    $regexMatch: { input: "$obstacle", regex: /VERY CLOSE/i },
                  },
                  then: "VERY CLOSE",
                },
              ],
              default: "OTHER",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 4. SOS preceding events – count of water/obstacles before each SOS
// ----------------------------------------------------------------------
router.get("/sos-preceding", async (req, res) => {
  try {
    const windowSec = parseInt(req.query.windowSec) || 10;
    const sosEvents = await Stats.find({ sos: true })
      .sort({ createdAt: 1 })
      .select("createdAt");

    let precedingWater = 0;
    let precedingVeryClose = 0;
    let precedingAnyObstacle = 0;

    for (const sos of sosEvents) {
      const sosTime = sos.createdAt;
      const startWindow = new Date(sosTime.getTime() - windowSec * 1000);
      const preceding = await Stats.find({
        createdAt: { $gte: startWindow, $lt: sosTime },
        _id: { $ne: sos._id },
      });
      for (const ev of preceding) {
        if (ev.water && /detected/i.test(ev.water)) precedingWater++;
        if (ev.obstacle) {
          precedingAnyObstacle++;
          if (/VERY CLOSE/i.test(ev.obstacle)) precedingVeryClose++;
        }
      }
    }

    res.json({
      windowSeconds: windowSec,
      totalSOS: sosEvents.length,
      precedingWater,
      precedingAnyObstacle,
      precedingVeryClose,
      averagePerSOS: {
        water: sosEvents.length
          ? (precedingWater / sosEvents.length).toFixed(2)
          : 0,
        veryClose: sosEvents.length
          ? (precedingVeryClose / sosEvents.length).toFixed(2)
          : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// 5. User & device status timeline
// ----------------------------------------------------------------------
router.get("/status-timeline", async (req, res) => {
  try {
    const statusChanges = await Stats.find({
      $or: [
        { userStatus: { $exists: true, $ne: null } },
        { deviceStatus: { $exists: true, $ne: null } },
      ],
    })
      .sort({ createdAt: 1 })
      .select("userStatus deviceStatus createdAt");
    res.json(statusChanges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/// 6. Hourly heatmap data – SOS events only (day of week vs hour)
// ----------------------------------------------------------------------
router.get("/heatmap", async (req, res) => {
  try {
    const heatmap = await Stats.aggregate([
      { $match: { sos: true } }, // Only SOS events
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1=Sunday ... 7=Saturday
          hour: { $hour: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { day: "$dayOfWeek", hour: "$hour" },
          sosCount: { $sum: 1 }, // Count SOS presses
        },
      },
      { $sort: { "_id.day": 1, "_id.hour": 1 } },
    ]);
    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
