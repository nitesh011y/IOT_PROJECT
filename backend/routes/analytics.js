const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats.model");

// ===============================
// 1. TOTAL RECORD COUNT
// ===============================
router.get("/total", async (req, res) => {
  try {
    const total = await Stats.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 2. SOS DESCRIPTIVE STATISTICS
// ===============================
router.get("/sos-stats", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: "$sos",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 3. WATER DESCRIPTIVE STATISTICS
// ===============================
router.get("/water-stats", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: "$water",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 4. OBSTACLE DESCRIPTIVE STATISTICS
// ===============================
router.get("/obstacle-stats", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: "$obstacle",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // for MODE
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 5. SOS + OBSTACLE (RISK PATTERN)
// ===============================
router.get("/sos-obstacle", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: {
            sos: "$sos",
            obstacle: "$obstacle",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 6. SOS + WATER
// ===============================
router.get("/sos-water", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: {
            sos: "$sos",
            water: "$water",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 7. WATER + OBSTACLE
// ===============================
router.get("/water-obstacle", async (req, res) => {
  try {
    const data = await Stats.aggregate([
      {
        $group: {
          _id: {
            water: "$water",
            obstacle: "$obstacle",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 8. COMPLETE DESCRIPTIVE SUMMARY (ONE API)
// ===============================
router.get("/summary", async (req, res) => {
  try {
    const total = await Stats.countDocuments();

    const sos = await Stats.aggregate([
      { $group: { _id: "$sos", count: { $sum: 1 } } },
    ]);

    const water = await Stats.aggregate([
      { $group: { _id: "$water", count: { $sum: 1 } } },
    ]);

    const obstacle = await Stats.aggregate([
      { $group: { _id: "$obstacle", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalRecords: total,
      sosStats: sos,
      waterStats: water,
      obstacleStats: obstacle,
      obstacleMode: obstacle[0]?._id || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
