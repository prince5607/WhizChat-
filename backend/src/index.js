import express from "express";
import authRouter from'./routes/auth.js'
import msgRouter from './routes/msgRoute.js';
import dotenv from 'dotenv';
import {connectDB} from'./lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app ,server} from './lib/socket.js';
import path from "path";
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