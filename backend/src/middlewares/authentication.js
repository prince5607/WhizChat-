
import{validateToken} from "../services/authentication.js";

export function restrictTo(){
    return (req,res,next)=>{
        
        try {
        const tokenCookieValue = req.cookies.token;
        if(!tokenCookieValue) return res.status(401).json({message : "Unauthorized : no token !!"});

        const userPayload = validateToken(tokenCookieValue);
        if(!userPayload) return res.status(401).json({message : "Unauthorized : invalid token!!"});
        req.user = userPayload;

        return next();

        } catch (error) {
            console.log("Error in restrictTo middleware",error.message);
            return res.status(500).json({message : "Internal server Error"});
        }
        
    }
}

