import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.animated-section');
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className='py-10'>
      <div className='text-center pt-10 border-t animated-section glass p-6 relative z-10'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 animated-section glass p-8 relative z-10'>
        <img className='w-full md:max-w-[480px] rounded-2xl shadow-lg relative z-20' src={assets.contact_img} alt="" loading="lazy" />
        <div className='flex flex-col justify-center items-start gap-5 text-sm sm:text-base relative z-20'>
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

      <div className='animated-section glass p-6 relative z-10'>
        <NewsletterBox/>
      </div>
    </div>
  )
}

export default Contact
