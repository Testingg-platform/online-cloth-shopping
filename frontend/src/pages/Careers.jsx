import React, { useState, useRef } from 'react'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const jobOpenings = [
  {
    title: 'Product Designer',
    location: 'Washington, USA',
    type: 'Full-time',
    summary: 'Own the end-to-end experience for Outfit’s collections and campaigns.',
    responsibilities: [
      'Translate research insights into usable product interfaces.',
      'Collaborate closely with engineers to ship high-quality releases.',
      'Iterate quickly based on customer feedback and performance data.',
    ],
  },
  {
    title: 'Full Stack Engineer',
    location: 'Remote / Seattle, USA',
    type: 'Full-time',
    summary: 'Improve Outfit’s storefront and operational tooling for a global audience.',
    responsibilities: [
      'Ship customer-facing features in React + Node.js with solid test coverage.',
      'Build backend services that scale across inventory, orders, and personalization.',
      'Mentor teammates and contribute to architectural decisions.',
    ],
  },
  {
    title: 'Customer Success Specialist',
    location: 'New York, USA',
    type: 'Hybrid (3x week office)',
    summary: 'Deliver proactive support to Outfit shoppers and wholesale partners.',
    responsibilities: [
      'Manage escalations and turn every interaction into a brand moment.',
      'Partner with merchandising and logistics to keep expectations aligned.',
      'Report recurring product or process gaps to leadership.',
    ],
  },
]

const initialFormState = {
  name: '',
  email: '',
  location: '',
  role: jobOpenings[0].title,
  cv: null,
}

const Careers = () => {
  const [form, setForm] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const scrollToForm = (role) => {
    setForm((prev) => ({ ...prev, role }))
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setForm((prev) => ({ ...prev, cv: file }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.cv) {
      toast.warn('Please add your name, email, and attach a CV.')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success('Thanks! We received your CV and will follow up soon.')
      setForm(initialFormState)
      setIsSubmitting(false)
    }, 900)
  }

  return (
    <div className='space-y-12 py-12 md:py-16'>
      <div className='text-center'>
        <Title text1='CAREERS' text2='AT OUTFIT' />
        <h1 className='text-3xl sm:text-4xl font-semibold text-gray-900'>Join the team that dresses the world for everyday life.</h1>
        <p className='mt-4 text-gray-500 max-w-2xl mx-auto'>
          We are hiring thoughtful designers, engineers, and operators. Below are the open roles; if nothing matches
          today, feel free to submit your CV and we will keep you in mind.
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-6 lg:gap-8'>
        {jobOpenings.map((job) => (
          <article key={job.title} className='border border-blue-50 rounded-2xl p-5 bg-white shadow-sm flex flex-col'>
            <div className='flex items-center justify-between text-sm uppercase tracking-[0.2em] text-indigo-600 mb-2'>
              <span>{job.type}</span>
              <span>{job.location}</span>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>{job.title}</h2>
            <p className='text-gray-500 mt-3 flex-1'>{job.summary}</p>
            <ul className='text-sm text-gray-600 mt-4 space-y-2'>
              {job.responsibilities.map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='mt-[2px] text-indigo-500'>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollToForm(job.title)}
              className='mt-5 btn-primary w-full text-sm'
            >
              Apply for this role
            </button>
          </article>
        ))}
      </div>

      <div ref={formRef} id='career-form' className='max-w-2xl mx-auto bg-white border border-blue-50 rounded-3xl shadow-[0_20px_55px_rgba(15,23,42,0.08)] p-6 lg:p-10'>
        <Title text1='SEND US' text2='YOUR CV' />
        <p className='text-gray-600 mb-6'>
          Share a quick note on why you love Outfit, upload your CV, and we will follow up with next steps.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <label className='space-y-1 text-xs text-gray-500 uppercase tracking-[0.2em]'>
              Name
              <input
                name='name'
                value={form.name}
                onChange={handleChange}
                className='input-base'
                placeholder='Your full name'
              />
            </label>
            <label className='space-y-1 text-xs text-gray-500 uppercase tracking-[0.2em]'>
              Email
              <input
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                className='input-base'
                placeholder='you@email.com'
              />
            </label>
          </div>
          <label className='space-y-1 text-xs text-gray-500 uppercase tracking-[0.2em]'>
            Preferred role
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='input-base'
            >
              {jobOpenings.map((job) => (
                <option key={job.title} value={job.title}>{job.title}</option>
              ))}
            </select>
          </label>
          <label className='space-y-1 text-xs text-gray-500 uppercase tracking-[0.2em]'>
            Current location
            <input
              name='location'
              value={form.location}
              onChange={handleChange}
              className='input-base'
              placeholder='City, Country'
            />
          </label>
          <label className='space-y-1 text-xs text-gray-500 uppercase tracking-[0.2em]'>
            Upload CV
            <input
              type='file'
              accept='.pdf,.doc,.docx'
              onChange={handleFileChange}
              className='w-full text-sm text-gray-600'
            />
          </label>
          <button
            type='submit'
            className='btn-primary w-full'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Careers
