import subCategoryModel from "../models/subCategoryModel.js";

// Add SubCategory
const addSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const subCategory = new subCategoryModel({ name, categoryId });
        await subCategory.save();
        res.json({ success: true, message: "SubCategory Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List SubCategories
const listSubCategory = async (req, res) => {
    try {
        const subcategories = await subCategoryModel.find({}).populate('categoryId');
        res.json({ success: true, subcategories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove SubCategory
const removeSubCategory = async (req, res) => {
    try {
        await subCategoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "SubCategory Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update SubCategory
const updateSubCategory = async (req, res) => {
    try {
        const { id, name, categoryId } = req.body;
        await subCategoryModel.findByIdAndUpdate(id, { name, categoryId });
        res.json({ success: true, message: "SubCategory Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addSubCategory, listSubCategory, removeSubCategory, updateSubCategory };
