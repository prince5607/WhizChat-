const express = require('express');
const authRouter = require('./routes/auth.js');
const msgRouter = require('./routes/msgRoute.js');
const dotenv = require('dotenv');
const {connectDB} = require('./lib/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { app ,server} = require('./lib/socket.js');
const path = require("path");
dotenv.config();  //to access .env variables




const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use('/api/auth',authRouter);
app.use('/api/message',msgRouter);

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{                            // * , means any route
        res.sendFile(path.join(__dirname,"../frontend", "dist", "index.html"));
    });
}



server.listen(PORT,()=>{
    console.log(`app is running on port no : ${PORT}`);
    connectDB();
});