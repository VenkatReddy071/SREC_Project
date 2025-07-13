const express=require("express");
const {Login,Sign,details,dashboard,adminProfile}=require("../../Controllers/User/Login")
const router=express.Router();
const User=require("../../models/User/LoginModel")
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
  console.log(req.session);
  if (req.session.user) {
    console.log(req.session.user);
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});


router.put('/:id/basic-edit', async (req, res) => {
  console.log(req.body,req.session.user);
    const { id } = req.params;

    console.log(id);
    const { username, gender, age, subscribe } = req.body;

    if (req.session.user.id.toString() !== id) {
        return res.status(403).json({ message: 'Not authorized to update this profile.' });
    }
    try {
        const user = await User.findById(id);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (username !== undefined) user.username = username;
        if (gender !== undefined) user.gender = gender;
        if (age !== undefined) user.age = age;
        if (subscribe !== undefined) user.subscribe = subscribe;

        await user.save();
        const updatedUserData = {
            id: user._id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            age: user.age,
            subscribe: user.subscribe,
        };

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUserData });

    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/profile/user/Data",async(req,res)=>{
  try{
    const user=req.session?.user;
    if(!user){
      return res.status(404).json({message:"User is Not Authorized"});
    }
    const userData=await User.findOne(req.session.user?.id);
    
    return res.status(200).json({message:"Profile data is found",user:userData});
  }
  catch (error) {
        console.error('Error updating user profile:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error' });
    }
})
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("session-id");
    res.status(200).json({ message: "Logged out" });
  });
});
module.exports=router;