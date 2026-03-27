import mongoose from 'mongoose';
import categoryModel from './models/categoryModel.js';
import subCategoryModel from './models/subCategoryModel.js';

const MONGODB_URI = "mongodb://127.0.0.1:27017/onlinecloth";

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB: ", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully.");

        const mainCategories = ["Men", "Women", "Kids"];
        const subCatNames = ["Topwear", "Winterwear", "Bottomwear"];

        for (const catName of mainCategories) {
            let category = await categoryModel.findOne({ name: catName });
            if (!category) {
                category = new categoryModel({
                    name: catName,
                    description: `${catName}'s collection`,
                });
                await category.save();
                console.log(`+ Created main category: ${catName}`);
            } else {
                console.log(`- Category ${catName} already exists.`);
            }

            for (const subName of subCatNames) {
                const subExists = await subCategoryModel.findOne({ 
                    name: subName, 
                    categoryId: category._id 
                });
                if (!subExists) {
                    const newSub = new subCategoryModel({
                        name: subName,
                        categoryId: category._id
                    });
                    await newSub.save();
                    console.log(`  + Created subcategory: ${subName} for ${catName}`);
                } else {
                    console.log(`  - Subcategory ${subName} for ${catName} already exists.`);
                }
            }
        }

        console.log("\nDone seeding. Closing connection...");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Critical Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
