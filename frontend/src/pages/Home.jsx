import React, { useLayoutEffect, useRef } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.animated-section');
      sections.forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
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
    <div ref={containerRef} className='flex flex-col gap-10 overflow-hidden py-10'>
      <section className='section-block animated-section'>
        <Hero />
      </section>
      <section className='section-block animated-section glass p-6 relative z-10'>
        <LatestCollection/>
      </section>
      <section className='section-block animated-section glass p-6 relative z-10'>
        <BestSeller/>
      </section>
      <section className='section-slab animated-section relative z-10'>
        <OurPolicy/>
      </section>
      <section className='section-block animated-section glass p-6 relative z-10'>
        <NewsletterBox/>
      </section>
    </div>
  )
}

export default Home
