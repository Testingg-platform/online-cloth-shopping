import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm text-gray-600 dark:text-white'>
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-4 dark:invert dark:brightness-200 contrast-125' alt="" loading="lazy" />
        <p className=' font-semibold dark:text-white'>Easy Exchange Policy</p>
        <p className=' text-gray-400 dark:text-gray-300'>We offer hassle free exchange policy</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-4 dark:invert dark:brightness-200 contrast-125' alt="" loading="lazy" />
        <p className=' font-semibold dark:text-white'>7 Days Return Policy</p>
        <p className=' text-gray-400 dark:text-gray-300'>We provide 7 days free return policy</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-4 dark:invert dark:brightness-200 contrast-125' alt="" loading="lazy" />
        <p className=' font-semibold dark:text-white'>Best customer support</p>
        <p className=' text-gray-400 dark:text-gray-300'>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}
export default OurPolicy
