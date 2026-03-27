import userModel from "../models/userModel.js"

const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }
        const wishlistData = Array.isArray(userData.wishlistData) ? userData.wishlistData : []
        res.json({ success: true, wishlistData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }
        const wishlistData = Array.isArray(userData.wishlistData) ? userData.wishlistData : []
        if (!wishlistData.includes(itemId)) {
            wishlistData.push(itemId)
            await userModel.findByIdAndUpdate(userId, { wishlistData })
        }
        res.json({ success: true, message: "Added To Wishlist" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }
        const wishlistData = Array.isArray(userData.wishlistData) ? userData.wishlistData : []
        const nextWishlist = wishlistData.filter((id) => id !== itemId)
        await userModel.findByIdAndUpdate(userId, { wishlistData: nextWishlist })
        res.json({ success: true, message: "Removed From Wishlist" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { getUserWishlist, addToWishlist, removeFromWishlist }
