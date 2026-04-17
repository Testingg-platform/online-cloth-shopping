import React, { useLayoutEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const Hero = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Elegant text reveal
      gsap.from('.hero-text-anim', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.1
      });

      // Subtle image pan/scale
      gsap.from('.hero-img-anim', {
        scale: 1.05,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out'
      });
    }, heroRef);
    return () => ctx.revert();
  }, [])
  return (
    <div ref={heroRef} className='flex flex-col sm:flex-row glass overflow-hidden'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0'>
            <div className='text-gray-800 dark:text-gray-100'>
                <div className='flex items-center gap-2 hero-text-anim'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#5b84f1]'></p>
                    <p className='text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-[#5b84f1]'>Curated Picks</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed hero-text-anim'>Fresh Drops for Every Day</h1>
                <p className='text-sm text-gray-500 max-w-sm hero-text-anim'>Soft fabrics, clean fits, and effortless styles — delivered to your door.</p>
                <div className='flex items-center gap-3 mt-5 hero-text-anim'>
                    <button className='btn-primary' onClick={()=>navigate('/collection')}>Shop Now</button>
                    <button className='btn-ghost' onClick={()=>navigate('/collection')}>Explore</button>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2 p-4 sm:p-6'>
        <div className='overflow-hidden rounded-2xl shadow-lg'>
          <img className='w-full hero-img-anim transform' src={assets.hero_img} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero
