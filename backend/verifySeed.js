import mongoose from 'mongoose';
import categoryModel from './models/categoryModel.js';
import subCategoryModel from './models/subCategoryModel.js';

const MONGODB_URI = "mongodb://127.0.0.1:27017/onlinecloth";

const verifySeeding = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        const categories = await categoryModel.find({});
        console.log(`Found ${categories.length} categories.`);
        
        for (const cat of categories) {
            const subs = await subCategoryModel.find({ categoryId: cat._id });
            console.log(`- ${cat.name}: ${subs.map(s => s.name).join(', ')}`);
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
};

verifySeeding();
