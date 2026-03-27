import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {
    
    const {currency, wishlistItems, addToWishlist, removeFromWishlist, token, navigate} = useContext(ShopContext);
    const [quickOpen, setQuickOpen] = useState(false)
    const isWishlisted = wishlistItems.includes(id)

  return (
    <>
      <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 dark:text-gray-200 cursor-pointer' to={`/product/${id}`}>
        <div className='card product-card hover-zoom overflow-hidden dark:bg-zinc-900 dark:border-zinc-800'>
          <div className='relative'>
            <img className='w-full h-56 object-cover' src={image[0]} alt={name} loading="lazy" />
            <button
              className={`wishlist-btn ${isWishlisted ? 'wishlist-btn-active' : ''}`}
              onClick={async (e)=>{ 
                e.preventDefault(); 
                e.stopPropagation(); 
                if (!token) { navigate('/login'); return; }
                if (isWishlisted) {
                  await removeFromWishlist(id)
                } else {
                  await addToWishlist(id)
                }
              }}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg viewBox="0 0 24 24" className='wishlist-icon'>
                <path d="M12 21s-7.5-4.35-10-8.5C.5 8.35 2.5 5 6 5c2 0 3.5 1.2 4 2.1C10.5 6.2 12 5 14 5c3.5 0 5.5 3.35 4 7.5-2.5 4.15-10 8.5-10 8.5z"/>
              </svg>
            </button>
            <button
              className='btn-primary text-[11px] px-3 py-1.5 quick-view-btn'
              onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setQuickOpen(true); }}
              aria-label={`Quick view ${name}`}
            >
              Quick View
            </button>
          </div>
          <div className='p-3'>
            <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{name}</p>
            <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mt-1'>{currency}{price}</p>
          </div>
        </div>
      </Link>

      {quickOpen && (
        <div className='quick-view-overlay' onClick={()=>setQuickOpen(false)}>
          <div className='quick-view-modal' onClick={(e)=>e.stopPropagation()}>
            <img className='w-full h-64 object-cover' src={image[0]} alt={name} loading="lazy" />
            <div className='quick-view-body'>
              <div>
                <p className='text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400'>Quick View</p>
                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mt-1'>{name}</h3>
                <p className='text-base font-medium text-gray-600 dark:text-gray-400 mt-2'>{currency}{price}</p>
              </div>
              <div className='flex gap-3 flex-wrap'>
                <Link
                  to={`/product/${id}`}
                  onClick={() => { setQuickOpen(false); scrollTo(0,0); }}
                  className='btn-primary text-sm'
                >
                  View Details
                </Link>
                <button
                  className={`btn-ghost text-sm ${isWishlisted ? 'wishlist-btn-active' : ''}`}
                  onClick={async ()=>{ 
                    if (!token) { setQuickOpen(false); navigate('/login'); return; }
                    if (isWishlisted) {
                      await removeFromWishlist(id)
                    } else {
                      await addToWishlist(id)
                    }
                  }}
                >
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <button className='btn-ghost text-sm' onClick={()=>setQuickOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductItem
