import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { token, navigate, backendUrl } = useContext(ShopContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
          headers: { token }
        })
        if (response.data.success) {
          setProfile(response.data.user)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  if (loading) {
    return (
      <div className='py-14 text-center text-gray-600'>
        Loading profile...
      </div>
    )
  }

  return (
    <div className='py-10'>
      <div className='max-w-xl mx-auto card p-6 sm:p-8'>
        <div className='flex items-center gap-4'>
          <img src={assets.profile_icon} alt="" className='w-12 h-12 dark:invert' />
          <div>
            <p className='text-lg font-semibold text-gray-800'>My Profile</p>
            <p className='text-sm text-gray-500'>Account details</p>
          </div>
        </div>

        <div className='mt-6 grid gap-4 text-gray-700'>
          <div>
            <p className='text-xs uppercase text-gray-400'>Name</p>
            <p className='text-base'>{profile?.name || '-'}</p>
          </div>
          <div>
            <p className='text-xs uppercase text-gray-400'>Email</p>
            <p className='text-base'>{profile?.email || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
