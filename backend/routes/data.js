const router = require("../utils/router_boilder");

const { getData } = require("../controler/data_controler");

router.get("/data", getData);
module.exports = router;
