const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controler/Auth_controler");

const router = require("../utils/router_boilder");

// ================= REGISTER =================
router.post("/register", registerUser);

// ================= LOGIN =================
router.post("/login", loginUser);

// ================= GET CURRENT USER =================
router.get("/me", getMe);

// ================= LOGOUT =================

router.post("/logout", logoutUser);

module.exports = router;

module.exports = router;
