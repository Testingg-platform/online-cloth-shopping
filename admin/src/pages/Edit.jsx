import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const sizeOptions = ["S", "M", "L", "XL", "XXL"]

const emptySlot = { file: null, url: '' }

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [imageSlots, setImageSlots] = useState([emptySlot, emptySlot, emptySlot, emptySlot])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  
  // New fields for Beauty category
  const [targetAudience, setTargetAudience] = useState("Women")
  const [measurementType, setMeasurementType] = useState("ml")
  const [values, setValues] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/subcategory/list')
      if (response.data.success) {
        setSubCategories(response.data.subcategories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchCategories(), fetchSubCategories()])
      const response = await axios.post(backendUrl + "/api/product/single", { productId: id })
      if (response.data.success) {
        const product = response.data.product
        setName(product?.name || "")
        setDescription(product?.description || "")
        setPrice(product?.price ?? "")
        setCategory(product?.category || "Men")
        setSubCategory(product?.subCategory || "Topwear")
        setBestseller(Boolean(product?.bestseller))
        setSizes(Array.isArray(product?.sizes) ? product.sizes : [])
        setTargetAudience(product?.targetAudience || "Women")
        setMeasurementType(product?.measurementType || "ml")
        setValues(Array.isArray(product?.values) ? product.values : [])
        const images = Array.isArray(product?.image) ? product.image : []
        setImageSlots([0, 1, 2, 3].map((i) => ({
          file: null,
          url: images[i] || ''
        })))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onImageChange = (index, file) => {
    setImageSlots((prev) => prev.map((slot, i) => (
      i === index ? { ...slot, file } : slot
    )))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("productId", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      
      if (category === "Clothing") {
        formData.append("sizes", JSON.stringify(sizes))
      } else if (category === "Beauty") {
        formData.append("targetAudience", targetAudience)
        formData.append("measurementType", measurementType)
        formData.append("values", JSON.stringify(values))
        formData.append("sizes", JSON.stringify([]))
      } else {
        formData.append("sizes", JSON.stringify(sizes))
      }
      formData.append("imageUrls", JSON.stringify(imageSlots.map((slot) => slot.file ? "" : (slot.url || ""))))

      imageSlots.forEach((slot, idx) => {
        if (slot.file) {
          formData.append(`image${idx + 1}`, slot.file)
        }
      })

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className='admin-panel'>
        <div className='admin-card p-6'>
          <p className='text-sm text-gray-500'>Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Edit Product</p>
          <p className='admin-muted text-sm mt-1'>Update pricing, sizing, and visuals.</p>
        </div>
        <div className='flex gap-2'>
          <span className='admin-chip'>Editing</span>
          <span className='admin-chip admin-chip-active'>Live</span>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 admin-card p-6'>
          <div className='mb-5'>
            <p className='text-sm font-semibold text-gray-700 mb-2'>Product name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} className='admin-input w-full' type="text" placeholder='Type here' required/>
          </div>

          <div className='mb-5'>
            <p className='text-sm font-semibold text-gray-700 mb-2'>Product description</p>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='admin-input w-full min-h-[120px]' type="text" placeholder='Write content here' required/>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Category</p>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className='admin-input w-full'>
                  {categories.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Sub category</p>
              <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='admin-input w-full'>
                  {subCategories.filter(item => !category || item.categoryId?.name === category).map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Price</p>
              <input onChange={(e) => setPrice(e.target.value)} value={price} className='admin-input w-full' type="Number" placeholder='25' />
            </div>
          </div>

          {category === "Clothing" ? (
            <div className='mt-6'>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Product Sizes</p>
              <div className='flex flex-wrap gap-2'>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                    className={`admin-chip ${sizes.includes(size) ? "admin-chip-active" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : category === "Beauty" ? (
            <div className='mt-6 space-y-5'>
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2'>Ideal For</p>
                <div className='flex flex-wrap gap-2'>
                  {["Men", "Women", "Kids", "Unisex"].map(item => (
                    <button 
                      key={item}
                      type='button' 
                      onClick={() => setTargetAudience(item)} 
                      className={`admin-chip ${targetAudience === item ? "admin-chip-active" : ""}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>Measurement Type</p>
                  <select 
                    onChange={(e) => {
                      setMeasurementType(e.target.value);
                      setValues([]); 
                    }} 
                    value={measurementType} 
                    className='admin-input w-full'
                  >
                    <option value="ml">ml (Milliliters)</option>
                    <option value="L">l (Liters)</option>
                    <option value="qty">qty (Quantity)</option>
                  </select>
                </div>
                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>Select {measurementType} Values</p>
                  <div className='flex flex-wrap gap-2'>
                    {(measurementType === 'ml' ? [50, 100, 200, 500] : [1, 2, 3, 5, 10]).map(val => (
                      <button 
                        key={val}
                        type='button' 
                        onClick={() => setValues(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val])} 
                        className={`admin-chip ${values.includes(val) ? "admin-chip-active" : ""}`}
                      >
                        {val} {measurementType !== 'qty' ? measurementType : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-6'>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Product Sizes</p>
              <div className='flex flex-wrap gap-2'>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                    className={`admin-chip ${sizes.includes(size) ? "admin-chip-active" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='flex items-center gap-2 mt-6'>
            <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
            <label className='cursor-pointer text-sm text-gray-600' htmlFor="bestseller">Add to bestseller</label>
          </div>
        </div>

        <div className='admin-card p-6'>
          <p className='text-sm font-semibold text-gray-700 mb-3'>Update Images</p>
          <p className='text-xs text-gray-400 mb-4'>Replace any image slot by selecting a new file.</p>

          <div className='grid grid-cols-2 gap-3'>
            {imageSlots.map((slot, idx) => (
              <label key={idx} htmlFor={`image${idx + 1}`} className='cursor-pointer'>
                <img
                  className='w-full rounded-xl border border-dashed border-[#cfe0ff] bg-[#f4f8ff] p-2'
                  src={slot.file ? URL.createObjectURL(slot.file) : (slot.url || assets.upload_area)}
                  alt=""
                />
                <input onChange={(e)=>onImageChange(idx, e.target.files[0])} type="file" id={`image${idx + 1}`} hidden/>
              </label>
            ))}
          </div>

          <button type="submit" className='admin-cta w-full mt-6'>Update Product</button>
        </div>
      </form>
    </div>
  )
}

export default Edit
