const router = require("../utils/router_boilder");

const { export_csv, filter_data } = require("../controler/history_panel");

// GET: Fetch history with filters
router.get("/", filter_data);

// GET: Export CSV
router.get("/export", export_csv);

module.exports = router;
