import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Add = ({token}) => {
  const navigate = useNavigate()

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    
    // New fields for Beauty category
    const [targetAudience, setTargetAudience] = useState("Women");
    const [measurementType, setMeasurementType] = useState("ml");
    const [values, setValues] = useState([]);
    const [qty, setQty] = useState(1);

    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list')
        if (response.data.success) {
          setCategories(response.data.categories)
          if (response.data.categories.length > 0) setCategory(response.data.categories[0].name)
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
          if (response.data.subcategories.length > 0) setSubCategory(response.data.subcategories[0].name)
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      fetchCategories()
      fetchSubCategories()
    }, [])


   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      
      if (category === "Clothing") {
        formData.append("sizes", JSON.stringify(sizes))
      } else if (category === "Beauty") {
        formData.append("targetAudience", targetAudience)
        formData.append("measurementType", measurementType)
        formData.append("values", JSON.stringify(values))
        formData.append("qty", qty)
        formData.append("sizes", JSON.stringify([])) // Send empty array for compatibility
      } else {
        formData.append("sizes", JSON.stringify(sizes))
      }

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Add New Product</p>
          <p className='admin-muted text-sm mt-1'>Upload images, set pricing, and publish instantly.</p>
        </div>
        <div className='flex gap-2'>
          <span className='admin-chip'>Draft</span>
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
              <select onChange={(e) => setCategory(e.target.value)} value={category} className='admin-input w-full'>
                  {categories.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='admin-input w-full'>
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
                {["S", "M", "L", "XL", "XXL"].map(size => (
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
                <p className='text-sm font-semibold text-gray-700 mb-2'>Available Quantity (1-3)</p>
                <select 
                  onChange={(e) => setQty(Number(e.target.value))} 
                  value={qty} 
                  className='admin-input w-full max-w-[200px]'
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

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
            </div>
          ) : (
            <div className='mt-6'>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Product Sizes</p>
              <div className='flex flex-wrap gap-2'>
                {["S", "M", "L", "XL", "XXL"].map(size => (
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
          <p className='text-sm font-semibold text-gray-700 mb-3'>Upload Images</p>
          <p className='text-xs text-gray-400 mb-4'>Add up to four images. First image is the cover.</p>

          <div className='grid grid-cols-2 gap-3'>
            <label htmlFor="image1" className='cursor-pointer'>
              <img className='w-full rounded-xl border border-dashed border-[#cfe0ff] bg-[#f4f8ff] p-2' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2" className='cursor-pointer'>
              <img className='w-full rounded-xl border border-dashed border-[#cfe0ff] bg-[#f4f8ff] p-2' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3" className='cursor-pointer'>
              <img className='w-full rounded-xl border border-dashed border-[#cfe0ff] bg-[#f4f8ff] p-2' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4" className='cursor-pointer'>
              <img className='w-full rounded-xl border border-dashed border-[#cfe0ff] bg-[#f4f8ff] p-2' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
          </div>

          <div className='mt-6 flex flex-col gap-3'>
            <button type="submit" className='admin-cta w-full'>Add Product</button>
            <button
              type="button"
              onClick={() => navigate('/list')}
              className='px-4 py-3 w-full rounded-xl border border-[#dfe4ef] text-sm font-medium text-gray-600 hover:bg-[#eef6ff] transition-all'
            >
              Close form
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Add
