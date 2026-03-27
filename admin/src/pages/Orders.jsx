import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const getPrimaryImage = (image) => {
    if (Array.isArray(image)) return image[0]
    if (typeof image === 'string') return image
    return ''
  }

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Order Management</p>
          <p className='admin-muted text-sm mt-1'>Track statuses and update fulfillment.</p>
        </div>
        <div className='flex gap-2'>
          <span className='admin-chip'>Total: {orders.length}</span>
          <span className='admin-chip admin-chip-active'>Live Orders</span>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {orders.map((order, index) => (
          <div className='admin-card p-5 md:p-6' key={index}>
            <div className='grid grid-cols-1 md:grid-cols-[0.6fr_2fr_1fr_0.8fr] gap-4 items-start'>
              <div className='flex items-start gap-3'>
                <img className='w-14 h-14 rounded-xl object-cover border' src={getPrimaryImage(order.items?.[0]?.image) || assets.parcel_icon} onError={(e)=>{e.currentTarget.src = assets.parcel_icon}} alt="" />
                <div>
                  <p className='text-[10px] uppercase tracking-wide text-gray-400'>Order</p>
                  <p className='text-xs text-gray-500'>#{order._id?.slice(-6)}</p>
                  <p className='text-[10px] text-gray-400 mt-1'>{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <div className='text-sm text-gray-700'>
                  {order.items.map((item, idx) => (
                    <p className='py-0.5' key={idx}>{item.name} x {item.quantity} <span> {item.size} </span></p>
                  ))}
                </div>
                <p className='mt-3 mb-1 font-medium'>
                  {(order.address?.firstName || '') + " " + (order.address?.lastName || '')}
                </p>
                <p className='text-xs text-gray-500'>
                  {(order.address?.street || '-') + ", " + (order.address?.city || '-') + ", " + (order.address?.state || '-') + ", " + (order.address?.country || '-') + " - " + (order.address?.zipcode || '-')}
                </p>
                <p className='text-xs text-gray-500 mt-1'>{order.address?.phone || '-'}</p>
              </div>

              <div className='text-sm text-gray-700'>
                <p>Items: {order.items.length}</p>
                <p className='mt-2'>Method: {order.paymentMethod}</p>
                <p>Payment: { order.payment ? 'Done' : 'Pending' }</p>
                <p className='mt-2 font-semibold text-gray-800'>{currency}{order.amount}</p>
              </div>

              <div className='flex flex-col gap-3'>
                <label className='text-xs text-gray-400'>Status</label>
                {order.status === "Cancelled" ? (
                    <p className='text-sm font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-200 text-center'>
                        Cancelled
                    </p>
                ) : (
                    <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='admin-input font-semibold'>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
