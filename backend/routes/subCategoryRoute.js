import express from 'express';
import { addSubCategory, listSubCategory, removeSubCategory, updateSubCategory } from '../controllers/subCategoryController.js';
import adminAuth from '../middleware/adminAuth.js';

const subCategoryRouter = express.Router();

subCategoryRouter.post('/add', adminAuth, addSubCategory);
subCategoryRouter.get('/list', listSubCategory);
subCategoryRouter.post('/remove', adminAuth, removeSubCategory);
subCategoryRouter.post('/update', adminAuth, updateSubCategory);

export default subCategoryRouter;
