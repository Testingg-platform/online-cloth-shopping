import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import { mapProductImages } from "../utils/localImages.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller, targetAudience, measurementType, values } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: sizes ? JSON.parse(sizes) : [],
            targetAudience: targetAudience || "",
            measurementType: measurementType || "",
            values: values ? JSON.parse(values) : [],
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const mapped = mapProductImages(products, baseUrl)
        res.json({success:true,products:mapped})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const [mapped] = mapProductImages([product], baseUrl)
        res.json({success:true,product: mapped})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, sizes, bestseller, imageUrls, targetAudience, measurementType, values } = req.body

        const product = await productModel.findById(productId)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        let parsedSizes = sizes
        if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes)
            } catch (error) {
                parsedSizes = []
            }
        }

        let existingImages = []
        let existingProvided = false
        if (typeof imageUrls !== 'undefined') {
            existingProvided = true
            try {
                existingImages = JSON.parse(imageUrls)
            } catch (error) {
                existingImages = []
            }
        } else {
            existingImages = Array.isArray(product.image) ? product.image : []
        }

        if (!Array.isArray(existingImages)) existingImages = []

        const image1 = req.files?.image1 && req.files.image1[0]
        const image2 = req.files?.image2 && req.files.image2[0]
        const image3 = req.files?.image3 && req.files.image3[0]
        const image4 = req.files?.image4 && req.files.image4[0]
        const uploads = [image1, image2, image3, image4]

        const uploadedUrls = await Promise.all(
            uploads.map(async (item) => {
                if (!item) return null
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        let nextImages = existingImages.map((url, idx) => uploadedUrls[idx] || url).filter(Boolean)
        if (!nextImages.length) {
            const uploadedOnly = uploadedUrls.filter(Boolean)
            if (uploadedOnly.length) {
                nextImages = uploadedOnly
            } else {
                nextImages = Array.isArray(product.image) ? product.image : []
            }
        }

        const updatedData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : Boolean(bestseller),
            sizes: parsedSizes,
            targetAudience: targetAudience || "",
            measurementType: measurementType || "",
            values: values ? (typeof values === 'string' ? JSON.parse(values) : values) : [],
            image: nextImages,
        }

        await productModel.findByIdAndUpdate(productId, updatedData)
        res.json({ success: true, message: "Product Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }
