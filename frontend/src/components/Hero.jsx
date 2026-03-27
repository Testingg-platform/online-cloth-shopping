import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col sm:flex-row glass'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0'>
            <div className='text-gray-800 dark:text-gray-100'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#5b84f1]'></p>
                    <p className='text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#5b84f1]'>Curated Picks</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Fresh Drops for Every Day</h1>
                <p className='text-sm text-gray-500 max-w-sm'>Soft fabrics, clean fits, and effortless styles — delivered to your door.</p>
                <div className='flex items-center gap-3 mt-5'>
                    <button className='btn-primary' onClick={()=>navigate('/collection')}>Shop Now</button>
                    <button className='btn-ghost' onClick={()=>navigate('/collection')}>Explore</button>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2 p-4 sm:p-6'>
        <img className='w-full rounded-2xl shadow-lg ' src={assets.hero_img} alt="" />
      </div>
    </div>
  )
}

export default Hero
