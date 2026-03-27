import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Users = ({ token }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(backendUrl + '/api/user/list', {
        headers: { token }
      })
      if (response.data.success) {
        setUsers(response.data.users || [])
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

  useEffect(() => {
    if (token) fetchUsers()
  }, [token])

  return (
    <div className='admin-panel'>
      <div className='flex items-start justify-between flex-wrap gap-4 mb-6'>
        <div>
          <p className='admin-section-title'>Customer Directory</p>
          <p className='admin-muted text-sm mt-1'>Track registered shoppers, their carts, and wishlist activity.</p>
        </div>
        <button
          type='button'
          onClick={fetchUsers}
          className='admin-chip admin-chip-active'
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className='py-10 text-center text-sm text-gray-400'>Loading users…</div>
      ) : users.length === 0 ? (
        <div className='py-10 text-center text-sm text-gray-500'>No users found.</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-100 text-sm'>
            <thead>
              <tr className='bg-white text-left text-xs uppercase tracking-[0.1em] text-gray-500'>
                <th className='px-4 py-3'>User</th>
                <th className='px-4 py-3 text-right'>Cart items</th>
                <th className='px-4 py-3 text-right'>Wishlist</th>
                <th className='px-4 py-3'>Cart preview</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {users.map((user) => (
                <tr key={user._id} className='bg-white'>
                  <td className='px-4 py-3'>
                    <p className='font-semibold text-gray-900'>{user.name || 'Unnamed user'}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                    <p className='text-[10px] text-gray-400'>#{user._id?.slice(-6)}</p>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <p className='font-semibold text-gray-900'>{user.cartCount}</p>
                    <span className='text-[10px] text-gray-400'>{user.uniqueItems} products</span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <p className='font-semibold text-gray-900'>{user.wishlistCount}</p>
                    <span className='text-[10px] text-gray-400'>{user.wishlistPreview?.length ? `${user.wishlistPreview.length} seen` : 'empty'}</span>
                  </td>
                  <td className='px-4 py-3'>
                    {user.cartSummary?.length ? (
                      <div className='space-y-1 text-xs text-gray-600'>
                        {user.cartSummary.map((entry, index) => (
                          <p key={entry.label + index}>{entry.label}</p>
                        ))}
                      </div>
                    ) : (
                      <span className='text-xs text-gray-400'>No cart entries</span>
                    )}
                    {user.wishlistPreview?.length ? (
                      <div className='mt-1 flex flex-wrap gap-1 text-[10px] text-gray-500'>
                        {user.wishlistPreview.map((item) => (
                          <span key={item} className='rounded-full border border-gray-200 px-2 py-0.5 uppercase tracking-wider'>
                            #{item?.slice(-6)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Users
