const User=require("../../models/User/LoginModel");
const bcrypt=require("bcryptjs")
const Login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const existUser=await User.findOne({email});
        if(!existUser){
            return res.status(404).json({message:"User Deatils not found please sign up"});
        }

        const compare=bcrypt.compare(password,existUser.password);
        if(!compare){
            return res.status(400).json({message:"Password not Match"});
        }
        req.session.user = { email };
        return res.status(200).json({message:"Login successfull"});
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}

const Sign=async(req,res)=>{
    console.log("hello")
    try{
        const {username,password,email,type}=req.body;
        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(404).json({message:"User Deatils already exist please login"});
        }
        const newUser=new User({
            username,
            email,
            password,
            type,
        })
        await newUser.save();
          req.session.user = { email };
        return res.status(200).json({message:"sign in successfull"})
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}

const details = async (req, res) => {
  try {
    const userDetails = await User.find({}).sort({ _id: -1 });
    return res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports={Login,Sign,details}