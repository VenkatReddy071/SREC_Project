const User = require("../../models/User/LoginModel");
const bcrypt = require("bcryptjs");
const { generateAuthToken,authenticateToken}=require("../Authorization/auth");
const { generateOtp } =require( '../../Utilities/otpUtils');
const { sendEmail } =require('../../Utilities/Email');
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "User details not found. Please sign up." });
        }

        const compare = await bcrypt.compare(password, existUser.password);
        if (!compare) {
            return res.status(400).json({ message: "Password does not match." });
        }

        req.session.user = { username: existUser.username, id: existUser._id,email:existUser.email };
        req.session.save(err => {
            if (err) {
                console.error("Session save error in Login:", err);
                return res.status(500).json({ message: "Login successful but failed to save session." });
            }
            return res.status(200).json({ message: "Login successful" });
        });

    } catch (error) {
        console.error("Error during Login:", error); // Added more specific logging
        return res.status(500).json({ message: "An error occurred during login. Please try again." }); // More generic error message for user
    }
};

//     try {
//         const { username, password, email, type } = req.body;
//         console.log(req.body);
//         const existUser = await User.findOne({ email });
//         if (existUser) {
//             return res.status(409).json({ message: "User with this email already exists. Please login." }); // 409 Conflict is more appropriate
//         }
//         const newUser = new User({
//             username,
//             email,
//             password,
//             type,
//         });

//         await newUser.save();
//         let token;
        
//         if(type==="user"){
//             req.session.user = { username, id: newUser._id,email:email };
//             req.session.save(err => {
//             if (err) {
//                 console.error("Session save error in Sign:", err);
//                 return res.status(500).json({ message: "Sign up successful but failed to save session." });
//             }
            
//         });
//         }
//         else{
//         token = await generateAuthToken(newUser);

//         }
        
//         return res.status(200).json({ message: "Sign in successful",token,newUser });
        

//     } catch (error) {
//         console.error("Error during Sign Up:", error); // Added more specific logging
//         return res.status(500).json({ message: "An error occurred during sign up. Please try again." });
//     }
// };
const Sign = async (req, res) => {
    try {
        const { username, password, email, type } = req.body;
        console.log("Sign up request body:", req.body);

        const existUser = await User.findOne({ email });
        if (existUser) {
            if (existUser.isVerified === false) {
                return res.status(409).json({ message: "User with this email already exists but is not verified. Please verify your email or log in." });
            }
            return res.status(409).json({ message: "User with this email already exists. Please login." });
        }

        const newUser = new User({
            username,
            email,
            password,
            type,
            isVerified: type === "user" ? false : true,
        });


        if (type === "user") {
            req.session.user = { username, id: newUser._id,email:email };
            req.session.save(err => {
            if (err) {
                console.error("Session save error in Sign:", err);
                return res.status(500).json({ message: "Sign up successful but failed to save session." });
            }
            })
            const otpCode = generateOtp();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            newUser.otp=otpCode;
            newUser.otpExpires=otpExpires;
            newUser.otpType='email_verify';
            await newUser.save();

            const emailSubject = "Verify Your Email for Account Creation";
            const emailText = `Hello ${username},\n\nYour OTP for email verification is: ${otpCode}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nThanks,\nYour Application Team`;
            const emailHtml = `
                <p>Hello <strong>${username}</strong>,</p>
                <p>Your OTP for email verification is: <strong>${otpCode}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                <p>Thanks,</p>
                <p>Your NANDYAL INFO Team</p>
            `;

            await sendEmail(newUser.email, emailSubject, emailText, emailHtml);

            return res.status(200).json({
                message: "Sign up successful. An OTP has been sent to your email for verification.",
                newUser: { id: newUser._id, email: newUser.email, username: newUser.username }
            });

        } else {
            await newUser.save();
            const token = await generateAuthToken(newUser);
            return res.status(200).json({ message: "Sign up successful", token, newUser });
        }

    } catch (error) {
        console.error("Error during Sign Up:", error);
        return res.status(500).json({ message: "An error occurred during sign up. Please try again." });
    }
};
const details = async (req, res) => {
    try {
        const userDetails = await User.find({}).sort({ _id: -1 });
        return res.status(200).json({ userDetails });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const dashboard = async (req, res) => {

    const { email, password } = req.body;

    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ message: "Email not found." });
        }
        const compare = await bcrypt.compare(password, findUser.password);
        if (!compare) {
            return res.status(401).json({ message: "Invalid credentials." }); // 401 Unauthorized
        }
        const token =await generateAuthToken(findUser);
        const { type, username, _id } = findUser;
        let url;
        if (type === "user") {
            return res.status(403).json({ message: "Access denied. This type of user does not have a dedicated dashboard." });
        }

        switch (type) {
            case "admin":
                url = "admin-dashboard";
                break;
            case "restaurant":
                url = "restaurant-dashboard";
                break;
            case "college":
                url = "education-dashboard";
                break;
            case "school":
                url = "education-dashboard";
                break;
            case "fashion":
                url = "fashion-dashboard";
                break;
            case "hospital":
                url = "hospital-dashboard";
                break;
            default:
                url = "marketing-dashboard";
        }

        return res.status(200).json({ message: `Redirecting to ${url}`, url, type, username, id: _id,token });
    } catch (error) {
        console.error("Error during dashboard redirection:", error);
        return res.status(500).json({ error: "An error occurred during dashboard access. Please try again." });
    }
};


const adminProfile=async(req,res)=>{
     res.json({
        message: `Hello, ${req.user.username || req.user.email}! This is your profile data.`,
        userDataFromToken: req.user
    });
}

module.exports = { Login, Sign, details, dashboard,adminProfile };