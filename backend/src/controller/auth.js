import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.js";


export async function HandleUserSignUp(req,res){
    const{fullName,email,password} = req.body;
   
    try {
        const user = await User.create({
            fullName,
            email,
            password,  
        });
        return res.status(201).json({message : "Account is created!!"});

    } catch (error) {
      return  res.status(400).json({message : error});
    }
}

export async function HandleUserLogin(req,res){
    const{email,password} = req.body;
    try{
        const token = await User.matchPasswordandGenerateToken(email,password);
        res.cookie("token",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, //prevent cross site scripting attacks
            sameSite : true,
        });
        return res.status(200).json({message : "user is logged in"});
    }catch(error){
        res.status(400).json({message: error.message});
    }
    
}
export function HandleUserLogout(req,res){
   res.clearCookie("token");
   return res.status(200).json({message : "Logout successfull"});
}

export async function HandleUpdateProfile(req,res){
    try {
        const {profilePic} = req.body;
        const userId = req.user.id;

        if(!profilePic) return res.status(400).json({message : "profilePic is required"});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);            //to store image on cloud 
        const updateUser = await User.findByIdAndUpdate(userId,{ profilePic : uploadResponse.secure_url},{new:true});   //new : true ,means it will give us the latest updated object
        return res.status(200).json(updateUser);
    } catch (error) {
        console.log("error in HandleUpdateProfile",error);
        return res.status(500).json({message : "Internal server error"});
    }
}

export function checkAuth(req,res){
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json("Internal server Error");
    }
}

