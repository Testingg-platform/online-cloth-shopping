import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token , currency, navigate} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            const normalizedItem = {
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              address: order.address,
              orderId: order._id
            }
            allOrdersItem.push(normalizedItem)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    if (!token) {
      toast.error('Please login to view orders')
      navigate('/login')
      return
    }
    loadOrderData()
  },[token])

  const handleTrackOrder = async (item) => {
    try {
      await loadOrderData()
      const dateText = item?.date ? new Date(item.date).toDateString() : 'N/A'
      toast.info(`Status: ${item?.status || 'N/A'} | Payment: ${item?.paymentMethod || 'N/A'} | Date: ${dateText}`)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/cancel', { orderId }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        loadOrderData()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='card p-4 mb-4 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20 rounded-lg border' src={item?.image?.[0] || ''} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{item?.date ? new Date(item.date).toDateString() : 'N/A'}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item?.paymentMethod || 'N/A'}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <p className={`min-w-2 h-2 rounded-full ${item.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button onClick={() => handleTrackOrder(item)} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                          {item.paymentMethod === 'COD' && item.status === 'Order Placed' && (
                            <button onClick={() => cancelOrder(item.orderId)} className='border border-red-300 text-red-500 px-4 py-2 text-sm font-medium rounded-sm hover:bg-red-50 transition-all'>Cancel Order</button>
                          )}
                        </div>
                    </div>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
