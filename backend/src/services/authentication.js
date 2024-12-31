const JWT = require('jsonwebtoken');


function createTokenForUser(user){

    const payload = {
        fullName : user.fullName,
        email : user.email,
        id : user._id,
        role : user.role,
        profilePic :user.profilePic
    }

    const token = JWT.sign(payload,process.env.JWT_SECRET,{expiresIn: "7d"});
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,process.env.JWT_SECRET);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}