import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array }, // Made optional for categories like Beauty
    targetAudience: { type: String }, // Beauty-specific (e.g., Men, Women, Kids)
    measurementType: { type: String }, // Beauty-specific (e.g., ml, L, qty)
    values: { type: Array }, // Beauty-specific values (e.g., [100, 200])
    qty: { type: Number }, // Beauty-specific (e.g., 1, 2, 3)
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel