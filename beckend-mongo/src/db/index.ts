import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Node.js DNS SRV query ECONNREFUSED on Windows/certain ISPs
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI!; 
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
