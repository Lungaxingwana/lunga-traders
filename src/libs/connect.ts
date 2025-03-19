import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectMongoDB = async () => {
    try {
        const connectionString = process.env.MONGO_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("MONGO_CONNECTION_STRING is not defined");
        }
        await mongoose.connect(connectionString);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectMongoDB;