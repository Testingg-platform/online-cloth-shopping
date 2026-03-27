import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {

    const [email, setEmail] = useState('')

    const onSubmitHandler = (event) => {
        event.preventDefault();
        toast.success('Thanks for subscribing!')
        setEmail('')
    }

  return (
    <div className='glass text-center py-10 px-6'>
      <p className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
      Fresh styles, special drops, and early access.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6'>
        <input className='soft-input w-full sm:flex-1' type="email" placeholder='Enter your email' required value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <button type='submit' className='btn-primary text-xs'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
