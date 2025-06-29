const express=require("express");
const {Login,Sign,details,dashboard,adminProfile}=require("../../Controllers/User/Login")
const router=express.Router();
const {authenticateToken}=require("../../Controllers/Authorization/auth");
const { requestPasswordReset, verifyOtpAndResetPassword, verifyEmailOtp,verifyPassword,changePassword,forgetPasswordOtp,subscribe} = require('../../Controllers/User/Verify.email');
router.post("/login",Login);
router.post("/sign",Sign);
router.get("/users",details);
router.get("/profile",authenticateToken,adminProfile);
router.post("/dashboard",dashboard);
router.post('/resend-otp', requestPasswordReset);
router.post('/reset-password', verifyOtpAndResetPassword);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/password',verifyPassword);
router.post("/forgot-password",forgetPasswordOtp);
router.post('/changePassword',changePassword);
router.post("/subscribe",subscribe);
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