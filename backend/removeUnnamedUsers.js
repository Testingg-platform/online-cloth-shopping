import mongoose from 'mongoose';
import 'dotenv/config';
import userModel from './models/userModel.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/onlinecloth";

const removeUnnamedUsers = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for removing unnamed users.");

        // Delete users with empty name, missing name, or whitespace-only name
        const result = await userModel.deleteMany({
            $or: [
                { name: "" },
                { name: { $exists: false } },
                { name: /^\s*$/ }
            ]
        });

        console.log(`Successfully removed ${result.deletedCount} unnamed user records.`);

        process.exit();
    } catch (error) {
        console.error("Removal failed:", error);
        process.exit(1);
    }
};

removeUnnamedUsers();
