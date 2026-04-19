import mongoose from 'mongoose';
import 'dotenv/config';
import userModel from './models/userModel.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/onlinecloth";

const fixUsers = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for fixing unnamed users.");

        // Find users with empty name or missing name
        const unnamedUsers = await userModel.find({
            $or: [
                { name: "" },
                { name: { $exists: false } },
                { name: /^\s*$/ } // Whitespace only
            ]
        });

        console.log(`Found ${unnamedUsers.length} unnamed users.`);

        for (const user of unnamedUsers) {
            const fallbackName = user.email.split('@')[0] || "User";
            user.name = fallbackName;
            await user.save();
            console.log(`Updated user ${user.email} with name: ${fallbackName}`);
        }

        console.log("Fix completed successfully.");
        process.exit();
    } catch (error) {
        console.error("Fix failed:", error);
        process.exit(1);
    }
};

fixUsers();
