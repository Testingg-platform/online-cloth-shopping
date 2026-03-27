import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div className='flex flex-col gap-10'>
      <section className='section-block'>
        <Hero />
      </section>
      <section className='section-block'>
        <LatestCollection/>
      </section>
      <section className='section-block'>
        <BestSeller/>
      </section>
      <section className='section-slab'>
        <OurPolicy/>
      </section>
      <section className='section-block'>
        <NewsletterBox/>
      </section>
    </div>
  )
}

export default Home
