const User = require("../../models/User/LoginModel");
const bcrypt = require("bcryptjs");
const { generateAuthToken,authenticateToken}=require("../Authorization/auth");

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

const Sign = async (req, res) => {
    try {
        const { username, password, email, type } = req.body;
        console.log(req.body);
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: "User with this email already exists. Please login." }); // 409 Conflict is more appropriate
        }
        const newUser = new User({
            username,
            email,
            password,
            type,
        });

        await newUser.save();

        req.session.user = { username, id: newUser._id,email:email };
        const token = generateAuthToken(newUser);
        
        req.session.save(err => {
            if (err) {
                console.error("Session save error in Sign:", err);
                return res.status(500).json({ message: "Sign up successful but failed to save session." });
            }
            return res.status(200).json({ message: "Sign in successful",token,newUser });
        });

    } catch (error) {
        console.error("Error during Sign Up:", error); // Added more specific logging
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
                url = "college-dashboard";
                break;
            case "school":
                url = "school-dashboard";
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

        return res.status(200).json({ message: `Redirecting to ${url}`, url, type, username, id: _id });
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