import categoryModel from "../models/categoryModel.js";
import cloudinary from 'cloudinary';

// Add Category
const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const categoryData = { name, description, image: imageUrl };
        const category = new categoryModel(categoryData);
        await category.save();

        res.json({ success: true, message: "Category Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Categories
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Category
const removeCategory = async (req, res) => {
    try {
        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        const imageFile = req.file;

        const updateData = { name, description };
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await categoryModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Category Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addCategory, listCategory, removeCategory, updateCategory };
