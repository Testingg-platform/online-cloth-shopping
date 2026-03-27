import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const SubCategory = ({ token }) => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategories(response.data.categories)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/subcategory/list')
      if (response.data.success) {
        setSubCategories(response.data.subcategories)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onSubCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (!categoryId) {
        toast.error("Please select a category")
        return
      }
      const response = await axios.post(backendUrl + '/api/subcategory/add', { name, categoryId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        fetchSubCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const onUpdateSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/subcategory/update', { id: editId, name: editName, categoryId: editCategoryId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setEditId(null)
        fetchSubCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeSubCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const response = await axios.post(backendUrl + '/api/subcategory/remove', { id }, { headers: { token } })
        if (response.data.success) {
          toast.success(response.data.message)
          fetchSubCategories()
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  const startEdit = (sub) => {
    setEditId(sub._id)
    setEditName(sub.name)
    setEditCategoryId(sub.categoryId?._id)
  }

  useEffect(() => {
    fetchCategories()
    fetchSubCategories()
  }, [])

  return (
    <div className='flex flex-col gap-8'>
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-blue-50'>
        <h2 className='text-xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
          <span className='p-2 bg-blue-100 rounded-lg text-blue-600 font-bold'>+</span>
          {editId ? 'Edit SubCategory' : 'SubCategory Management'}
        </h2>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
          {/* Form (Sticky) */}
          <div className='lg:sticky lg:top-6'>
            <form onSubmit={editId ? onUpdateSubCategory : onSubCategorySubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>Parent Category</p>
                <select onChange={(e) => editId ? setEditCategoryId(e.target.value) : setCategoryId(e.target.value)} value={editId ? editCategoryId : categoryId} className='admin-input w-full' required>
                  <option value="">Select Category</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>SubCategory Name</p>
                <input onChange={(e) => editId ? setEditName(e.target.value) : setName(e.target.value)} value={editId ? editName : name} className='admin-input w-full' type="text" placeholder="Type here" required />
              </div>
              <div className='flex gap-4'>
                <button type='submit' className='admin-cta admin-cta-sm w-max px-8 mt-2'>
                  {editId ? 'UPDATE SUBCATEGORY' : 'ADD SUBCATEGORY'}
                </button>
                {editId && (
                  <button type='button' onClick={() => setEditId(null)} className='px-8 mt-2 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50'>
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className='flex flex-col gap-4 pr-2'>
            <p className='text-sm font-medium sticky top-0 bg-white py-1 text-blue-600 uppercase tracking-widest'>All SubCategories</p>
            {subCategories.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${editId === item._id ? 'border-blue-400 bg-blue-50/50' : 'border-gray-100 bg-gray-50/40'} group`}>
                <div>
                  <p className='font-semibold text-gray-800'>{item.name}</p>
                  <p className='text-xs text-gray-500'>Category: {item.categoryId?.name || 'N/A'}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button onClick={() => startEdit(item)} className='p-2 text-blue-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-blue-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => removeSubCategory(item._id)} className='p-2 text-red-300 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubCategory
