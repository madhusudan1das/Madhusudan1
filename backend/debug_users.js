import { ENV } from "./src/lib/env.js";
import mongoose from "mongoose";
import User from "./src/models/User.js";

const debugUsers = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(ENV.MONGO_URI);
        console.log("DB Connected.");

        const users = await User.find({}, { email: 1, fullName: 1, _id: 1 });
        console.log(`Found ${users.length} users:`);
        console.table(users.map(u => ({ id: u._id.toString(), email: u.email, name: u.fullName })));

        if (users.length === 0) {
            console.log("WARNING: No users returned. The database is empty.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

debugUsers();
