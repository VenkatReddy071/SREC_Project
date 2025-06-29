const User = require('../../models/User/LoginModel');
const { sendEmail } = require('../../Utilities/Email');
const bcrypt = require('bcryptjs');
const { generateOtp } = require('../../Utilities/otpUtils');
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ status: "success", message: "If an account with that email exists, an OTP has been sent." });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        user.otpType = 'email_verify';
        await user.save();

        console.log(`Generated OTP for ${email} (password reset): ${otp}`);
        const emailSubject = "Verify Your Email for Account Creation";
            const emailText = `Hello ${user.username},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nThanks,\nYour Application Team`;
            const emailHtml = `
                <p>Hello <strong>${user.username}</strong>,</p>
                <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                <p>Thanks,</p>
                <p>Your NANDYAL INFO Team</p>
            `;
        await sendEmail(user.email, emailSubject, emailText, emailHtml);

        res.status(200).json({ status: "success", message: "OTP sent to your email." });

    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ status: "error", message: "Failed to send OTP. Please try again.", errors: error.message });
    }
};


const forgetPasswordOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ status: "success", message: "If an account with that email exists, an OTP has been sent." });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        user.otpType = 'forgot_password';
        await user.save();

        console.log(`Generated OTP for ${email} (password reset): ${otp}`);
        const emailSubject = "Verify Your Email for Account Recovery";
            const emailText = `Hello ${user.username},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nThanks,\nYour Application Team`;
            const emailHtml = `
                <p>Hello <strong>${user.username}</strong>,</p>
                <p>Your OTP for email verification is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                <p>Thanks,</p>
                <p>Your NANDYAL INFO Team</p>
            `;
        await sendEmail(user.email, emailSubject, emailText, emailHtml);

        res.status(200).json({ status: "success", message: "OTP sent to your email." });

    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ status: "error", message: "Failed to send OTP. Please try again.", errors: error.message });
    }
};
const verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }
        user.otp = null;
        user.otpExpires = null;
        user.otpType = null;
        user.password = newPassword;
        await user.save();

        res.status(200).json({ status: "success", message: "Password has been reset successfully!" });

    } catch (error) {
        console.error("Error in verifyOtpAndResetPassword:", error);
        res.status(500).json({ status: "error", message: "Failed to reset password. Please try again.", errors: error.message });
    }
};

const changePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        return res.status(200).json({ message: "Password updated successfully!" });

    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: "Failed to change password. Please try again later.", error: error.message });
    }
};

const verifyPassword = async (req, res) => {
    try {
        const { email,password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }
        const compare=await bcrypt.compare(password,user.password);
        if(!compare){
            res.status(500).json({ status: "error", message: "Password is wrong"});
        }
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.otpType = 'email_verify';
        await user.save();

        console.log(`Generated OTP for ${email} (password reset): ${otp}`);

        await sendEmail(
            email,
            'Password Reset OTP for ResolveFlow',
            `Your OTP for password reset is: ${otp}\nThis OTP is valid for 10 minutes.`,
            `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`
        );

        res.status(200).json({ status: "success", message: "Password has been reset successfully!" });

    } catch (error) {
        console.error("Error in verifyOtpAndResetPassword:", error);
        res.status(500).json({ status: "error", message: "Failed to reset password. Please try again.", errors: error.message });
    }
};
const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email,otp);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }
        console.log(user);
        if (!user.otp || user.otp !== otp  || user.otpExpires < new Date()) {
            return res.status(400).json({ status: "error", message: "Invalid or expired OTP." });
        }

        user.otp = null;
        user.otpExpires = null;
        user.otpType = null;
        user.verified = true;
        await user.save();

        res.status(200).json({ status: "success", message: "Email successfully verified! You can now log in." });

    } catch (error) {
        console.error("Error in verifyEmailOtp:", error);
        res.status(500).json({ status: "error", message: "Failed to verify email. Please try again.", errors: error.message });
    }
};

const subscribe=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Please Login to subscribe!"});
        }

        user.subscribe=true;
        await user.save();
        return res.status(200).json({message:"Thanks for Subscribing!"});
    }
    catch(error){
        return res.status(404).json({message:"Server Error"});
    }
}
module.exports = { requestPasswordReset, verifyOtpAndResetPassword, verifyEmailOtp,verifyPassword,changePassword,forgetPasswordOtp,subscribe };