const express=require("express");
const {Login,Sign,details,dashboard,adminProfile}=require("../../Controllers/User/Login")
const router=express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth")
router.post("/login",Login);
router.post("/sign",Sign);
router.get("/users",details);
router.get("/profile",authenticateToken,adminProfile);
router.post("/dashboard",dashboard);

router.get("/check-session", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("session-id");
    res.status(200).json({ message: "Logged out" });
  });
});
module.exports=router;