const router = require("../utils/router_boilder");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controler/Auth_controler");

router.post("/register", registerUser);
router.post("/login", loginUser);

// GET current user
router.get("/me", getMe);

// Logout
router.post("/logout", (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .json({ message: "Logged out successfully" });
});

module.exports = router;
