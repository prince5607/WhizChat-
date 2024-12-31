const {v2} = require("cloudinary");
const{config} = require("dotenv");
const cloudinary= v2;
config();

cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});

module.exports = cloudinary;