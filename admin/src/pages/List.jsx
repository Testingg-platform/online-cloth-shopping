import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const navigate = useNavigate()

  const getPrimaryImage = (image) => {
    if (Array.isArray(image)) return image[0]
    if (typeof image === 'string') return image
    return ''
  }

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Product Catalog</p>
          <p className='admin-muted text-sm mt-1'>Review and manage listed items.</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='admin-chip'>Total: {list.length}</span>
          <span className='admin-chip admin-chip-active'>Live List</span>
          <button
            type='button'
            onClick={() => navigate('/add')}
            className='admin-cta admin-cta-sm h-9 flex items-center justify-center'
          >
            Add Product
          </button>
        </div>
      </div>

      <div className='admin-card p-5'>
        <div className='hidden md:grid grid-cols-[0.7fr_3fr_1.2fr_1fr_0.8fr] items-center py-2 px-3 text-xs uppercase tracking-wider text-gray-400 border-b'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className='text-center'>Action</span>
        </div>

        <div className='flex flex-col divide-y'>
          {list.map((item, index) => (
            <div className='grid grid-cols-[0.7fr_3fr_1fr] md:grid-cols-[0.7fr_3fr_1.2fr_1fr_0.8fr] items-center gap-2 py-3 px-2 text-sm' key={index}>
              <img className='w-12 h-12 rounded-lg object-cover border' src={getPrimaryImage(item.image) || assets.upload_area} onError={(e)=>{e.currentTarget.src = assets.upload_area}} alt="" />
              <div>
                <p className='font-medium text-gray-800'>{item.name}</p>
                <p className='text-xs text-gray-400'>#{item._id?.slice(-6)}</p>
              </div>
              <p className='text-gray-600'>{item.category}</p>
              <p className='text-gray-800 font-semibold'>{currency}{item.price}</p>
              <div className='flex items-center justify-center gap-2'>
                <button
                  onClick={() => navigate(`/edit/${item._id}`)}
                  className='admin-cta admin-cta-sm text-xs active:scale-95'
                >
                  Edit
                </button>
                <button
                  onClick={()=>removeProduct(item._id)}
                  className='text-xs px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition'
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default List
