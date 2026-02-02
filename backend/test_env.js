import { ENV } from "./src/lib/env.js";
console.log("Port:", ENV.PORT);
console.log("Mongo URI Length:", ENV.MONGO_URI ? ENV.MONGO_URI.length : 0);

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Attempting DB connection...");
        await mongoose.connect(ENV.MONGO_URI);
        console.log("DB Connected successfully");
        process.exit(0);
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

connectDB();
