import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import dashboardRouter from './routes/dashboardRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import subCategoryRouter from './routes/subCategoryRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// middlewares
app.use(express.json())
app.use(cors())
app.use('/static', express.static(path.join(__dirname, 'public')))

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/wishlist',wishlistRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subCategoryRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))
