import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px] rounded-2xl shadow-lg' src={assets.about_img} alt="" loading="lazy" />
          <div className='flex flex-col justify-center gap-5 md:w-2/4 text-gray-600 text-sm sm:text-base'>
              <p>Outfit was built for people who want great basics without the noise. We focus on clean design, reliable quality, and a smooth shopping experience.</p>
              <p>Every drop is curated to keep your wardrobe sharp and effortless, from everyday tees to elevated layers.</p>
              <b className='text-gray-800 text-base'>Our Mission</b>
              <p>Make daily dressing feel easy - with honest pricing, fast delivery, and support that actually helps.</p>
          </div>
      </div>

      <div className='py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 text-sm mb-20 gap-4'>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>We test fabrics and fits so every piece feels premium, not predictable.</p>
          </div>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4'>
            <b>Convenience:</b>
            <p className='text-gray-600'>Fast search, clean filters, and a checkout that just works.</p>
          </div>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Real responses, quick fixes, and support you can count on.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
