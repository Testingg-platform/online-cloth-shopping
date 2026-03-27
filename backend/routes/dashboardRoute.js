import express from 'express'
import { getDashboardSummary } from '../controllers/dashboardController.js'
import adminAuth from '../middleware/adminAuth.js'

const dashboardRouter = express.Router()

dashboardRouter.get('/summary', adminAuth, getDashboardSummary)

export default dashboardRouter
