const {Schema ,model} = require('mongoose');
const {randomBytes,createHmac} = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName :{
        type : String,
        required : true
    },
    email :{
        type: String,
        required: true,
        unique : true
    },
    salt :{
        type: String,
    },
    password : {
        type : String,
        required : true
    },
    profilePic : {
        type: String,
        default: ""
    },
    role : {
        type :String,
        enum :["USER","ADMIN"],   // Agar inke alawa kuch or hua to mongo error throw krega
        default : "USER"
    }
},
{timestamps: true}
);

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt =salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordandGenerateToken', async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User does not exist!!");

    const userHashedPassword = user.password;
    const userSalt  = user.salt;

    const LoginHashedPassword = createHmac("sha256",userSalt).update(password).digest("hex");
    if(userHashedPassword !== LoginHashedPassword) throw new Error("Invalid password!!");
    const token = createTokenForUser(user);
    return token;
});



const User = model('user',userSchema);

module.exports = User;

