const {Server} = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : ["http://localhost:5173"]
    }
});

function getRecieverSocketId(userId){               //this function will be used to show messages in real time
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; //{userId : socketId} (format)


io.on("connection",(socket)=>{
    console.log("A user is connected: ",socket.id);

    const userId = socket.handshake.query.userId;
   
    if(userId) userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all the connected clients(broadcasting)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));                  //to tell the users how many users are online

    socket.on("disconnect",()=>{
        console.log("A user is disconnected: ",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));               //to tell the users which one is disconnected
    });
})

module.exports = {
    app,
    server,
    io,
    getRecieverSocketId
}