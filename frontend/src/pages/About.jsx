import React, { useLayoutEffect, useRef } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const About = () => {
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

      <div className='text-center pt-8 border-t animated-section glass p-6 relative z-10'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 animated-section glass p-8 relative z-10'>
          <img className='w-full md:max-w-[450px] rounded-2xl shadow-lg relative z-20' src={assets.about_img} alt="" loading="lazy" />
          <div className='flex flex-col justify-center gap-5 md:w-2/4 text-gray-600 text-sm sm:text-base relative z-20'>
              <p>Outfit was built for people who want great basics without the noise. We focus on clean design, reliable quality, and a smooth shopping experience.</p>
              <p>Every drop is curated to keep your wardrobe sharp and effortless, from everyday tees to elevated layers.</p>
              <b className='text-gray-800 text-base'>Our Mission</b>
              <p>Make daily dressing feel easy - with honest pricing, fast delivery, and support that actually helps.</p>
          </div>
      </div>

      <div className='py-4 animated-section glass p-6 relative z-10 mb-6'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 text-sm mb-20 gap-4 animated-section relative z-10'>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 relative z-20'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>We test fabrics and fits so every piece feels premium, not predictable.</p>
          </div>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 relative z-20'>
            <b>Convenience:</b>
            <p className='text-gray-600'>Fast search, clean filters, and a checkout that just works.</p>
          </div>
          <div className='card px-10 md:px-12 py-8 sm:py-12 flex flex-col gap-4 relative z-20'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Real responses, quick fixes, and support you can count on.</p>
          </div>
      </div>

      <div className='animated-section glass p-6 relative z-10'>
        <NewsletterBox/>
      </div>
      
    </div>
  )
}

export default About
