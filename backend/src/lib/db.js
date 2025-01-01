import mongoose from 'mongoose';

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo is connected : ${conn.connection.host}`);
    } catch (error) {
        console.log("Mongo Error :",error);
    }
}

