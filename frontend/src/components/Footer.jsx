import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className='glass mt-16 px-6 py-10 dark:bg-black/80 dark:border-zinc-800'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 text-sm'>

        <div>
            <img src={assets.logo} className='mb-4 w-32 dark:invert' alt="" loading="lazy" />
            <p className='w-full md:w-2/3 text-gray-600 dark:text-gray-400'>
            Outfit is your everyday wardrobe upgrade - curated drops, clean fits, and reliable quality delivered fast.
            </p>
        </div>

        <div>
            <p className='text-base font-semibold mb-4 text-gray-700 dark:text-gray-200'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600 dark:text-gray-400'>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>navigate('/')}>Home</li>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>navigate('/about')}>About us</li>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>toast.info('Delivery details will be updated soon.')}>Delivery</li>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>navigate('/privacy-policy')}>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-base font-semibold mb-4 text-gray-700 dark:text-gray-200'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600 dark:text-gray-400'>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>toast.info('Call: +9099119990')}>+9099119990</li>
                <li className='cursor-pointer hover:text-gray-900 dark:hover:text-white' onClick={()=>toast.info('Contact: hello@outfit.com')}>hello@outfit.com</li>
            </ul>
        </div>

      </div>

        <div className='mt-8'>
            <hr className='dark:border-zinc-800' />
            <p className='py-5 text-xs text-center text-gray-500 dark:text-gray-500'>Copyright hello@outfit.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
