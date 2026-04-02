const { registerUser, loginUser } = require("../controler/Auth_controler");

const router = require("../utils/router_boilder");
// ================= REGISTER =================
router.post("/register", registerUser);

// ================= LOGIN =================
router.post("/login", loginUser);
module.exports = router;
