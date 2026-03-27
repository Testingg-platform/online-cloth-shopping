import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] rounded-2xl shadow-lg' src={assets.contact_img} alt="" loading="lazy" />
        <div className='flex flex-col justify-center items-start gap-5 text-sm sm:text-base'>
          <p className='font-semibold text-lg text-gray-700'>Our Studio</p>
          <p className='text-gray-500'>139-140 silver arcade <br /> Mota Varachha, Surat</p>
          <p className='text-gray-500'>Tel: 9099119990 <br /> Email: hello@outfit.com</p>
          <p className='font-semibold text-lg text-gray-700'>Careers at Outfit</p>
          <p className='text-gray-500'>We are always looking for thoughtful designers and builders.</p>
          <Link to='/careers' className='btn-primary text-sm inline-flex items-center justify-center w-full sm:w-auto text-center'>
            Explore Jobs
          </Link>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
