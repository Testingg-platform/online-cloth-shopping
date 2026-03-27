import React, { useContext, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Wishlist = () => {
  const { products, currency, wishlistItems, removeFromWishlist, token, navigate } = useContext(ShopContext)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const wishlistProducts = useMemo(() => {
    if (!Array.isArray(products) || !products.length) return []
    return products.filter((item) => wishlistItems.includes(item._id))
  }, [products, wishlistItems])

  return (
    <div className='border-t-2 pt-10'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h2 className='text-2xl font-semibold'>Wishlist</h2>
          <p className='text-sm text-gray-500 mt-1'>Your saved items, ready when you are.</p>
        </div>
        <span className='text-xs text-gray-500'>Total: {wishlistProducts.length}</span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className='mt-10 card p-8 text-center text-gray-500 flex flex-col items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500'>
            <svg viewBox="0 0 24 24" className='wishlist-icon'>
              <path d="M12 21s-7-4.35-9.33-8.02C.5 9.52 1.24 6.4 3.64 4.9a5.06 5.06 0 0 1 5.58.3L12 7.35l2.78-2.15a5.06 5.06 0 0 1 5.58-.3c2.4 1.5 3.14 4.62.97 8.08C19 16.65 12 21 12 21z" />
            </svg>
          </div>
          <p>Your wishlist is empty. Browse products and tap the heart icon to save.</p>
          <Link to='/collection' className='btn-primary text-sm'>Browse Collection</Link>
        </div>
      ) : (
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wishlistProducts.map((item) => (
            <div key={item._id} className='card overflow-hidden relative'>
              <Link to={`/product/${item._id}`} onClick={() => scrollTo(0,0)}>
                <img className='w-full h-56 object-cover' src={item.image[0]} alt={item.name} loading="lazy" />
                <div className='p-4'>
                  <p className='text-sm font-semibold text-gray-800'>{item.name}</p>
                  <p className='text-sm font-medium text-gray-600 mt-1'>{currency}{item.price}</p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFromWishlist(item._id)
                }}
                className='wishlist-btn wishlist-btn-active'
                aria-label="Remove from wishlist"
              >
                <svg viewBox="0 0 24 24" className='wishlist-icon'>
                  <path d="M12 21s-7-4.35-9.33-8.02C.5 9.52 1.24 6.4 3.64 4.9a5.06 5.06 0 0 1 5.58.3L12 7.35l2.78-2.15a5.06 5.06 0 0 1 5.58-.3c2.4 1.5 3.14 4.62.97 8.08C19 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
