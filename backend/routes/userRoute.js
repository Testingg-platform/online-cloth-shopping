import express from 'express';
import { loginUser, registerUser, adminLogin, getProfile, getAllUsers } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getProfile)
userRouter.get('/list', adminAuth, getAllUsers)

export default userRouter;
