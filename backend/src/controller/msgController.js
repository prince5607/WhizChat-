import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io }  from "../lib/socket.js";

export async function getUsersForSidebar(req,res){                   
    try {
        const loggedInUserId = req.user._id;       //jo person abhi logged in h uski id
        const filteredUsers = await User.find({ _id :{ $ne : loggedInUserId}}).select('-password'); //get all the users except the loggedin one, $ne means not equals , -password means we do not want password
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error on user side bars :",error.message);
        return res.status(500).json({error : "internal server error"});
    }
}

export async function getAllMessages(req,res){
    try {
        const {id : userToChatId} = req.params;    //jis se chat kr rhe h uski id
        const myId = req.user.id;                  //logged in user ki id
        

        const messages = await Message.find({
            $or : [                                                         //or operator, all msgs that user had sent and receiver had sent
                {senderId : myId , recieverId : userToChatId},
                {senderId : userToChatId, recieverId: myId}
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("error in getting all users msgs :",error.message);
        res.status(500).json({error : "internal server error"});
    }
}

export async function sendMessage(req,res){
    try {
        const {text ,image}  = req.body;
        const { id: recieverId} = req.params;
        const senderId = req.user.id;

        let ImageUrl="";
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            ImageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image : ImageUrl
        });

        await newMessage.save();

        //socket.io realtime functionality
        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage);   // as emit funtion will broadcast message to all users that's why we are using to() method to only send the message to reciever 
        
        }

        res.status(201).json(newMessage);   //201 means resource has been created

    } catch (error) {
        console.log("error in sendMessage :",error.message);
        res.status(500).json({error : "internal server error"});
    }
}

