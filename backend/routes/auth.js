const router = require("../utils/router_boilder");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controler/Auth_controler");

// ================= REGISTER =================
router.post("/register", registerUser);

// ================= LOGIN =================
router.post("/login", loginUser);

// ================= GET CURRENT USER =================
router.get("/me", getMe);

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .json({ message: "Logged out successfully" });
});

module.exports = router;