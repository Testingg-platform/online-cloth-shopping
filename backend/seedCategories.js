import mongoose from 'mongoose';
import 'dotenv/config';
import categoryModel from './models/categoryModel.js';
import subCategoryModel from './models/subCategoryModel.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/onlinecloth";

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding.");

        // Clear existing categories and subcategories if needed (optional)
        // await categoryModel.deleteMany({});
        // await subCategoryModel.deleteMany({});

        const categories = ["Men", "Women", "Kids"];
        const subCategories = ["Topwear", "Winterwear", "Bottomwear"];

        for (const catName of categories) {
            // Check if exists
            let category = await categoryModel.findOne({ name: catName });
            if (!category) {
                category = new categoryModel({
                    name: catName,
                    description: `${catName}'s clothing collection`,
                });
                await category.save();
                console.log(`Added category: ${catName}`);
            }

            for (const subName of subCategories) {
                const subExists = await subCategoryModel.findOne({ name: subName, categoryId: category._id });
                if (!subExists) {
                    const subCategory = new subCategoryModel({
                        name: subName,
                        categoryId: category._id
                    });
                    await subCategory.save();
                    console.log(`Added subcategory: ${subName} for ${catName}`);
                }
            }
        }

        console.log("Seeding completed successfully.");
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
