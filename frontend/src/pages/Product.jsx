import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency ,addToCart, token, navigate, wishlistItems, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [addedPulse, setAddedPulse] = useState(false)
  const [wishlistPulse, setWishlistPulse] = useState(false)
  const [readMore, setReadMore] = useState(false)

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  const isWishlisted = productData && wishlistItems.includes(productData._id)

  return productData ? (
    <div className='transition-opacity ease-in duration-500 opacity-100'>
      
      {/*----------- Top Hero Section (100vh) -------------- */}
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-12 pt-6 lg:min-h-[calc(100vh-100px)] items-stretch'>

        {/*---------- Product Images Section ------------- */}
        <div className='flex-1 flex flex-col-reverse lg:flex-row gap-3 overflow-hidden'>
          {/* Thumbnails */}
          <div className='flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:w-[15%] w-full no-scrollbar lg:max-h-[600px]'>
              {
                productData.image.map((item,index)=>(
                  <img 
                    onClick={()=>setImage(item)} 
                    src={item} 
                    key={index} 
                    className={`w-[20%] lg:w-full mb-3 flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all ${item === image ? 'border-sky-500' : 'border-transparent opacity-70 hover:opacity-100 font-normal'}`} 
                    alt={productData.name} 
                  />
                ))
              }
          </div>
          {/* Main Image */}
          <div className='flex-1 relative lg:h-[600px]'>
              <img className='w-full h-full object-contain rounded-2xl shadow-sm bg-gray-50 dark:bg-zinc-900' src={image} alt={productData.name} />
              
              <button
                onClick={async () => {
                  if (!token) {
                    navigate('/login')
                    return
                  }
                  if (isWishlisted) {
                    await removeFromWishlist(productData._id)
                  } else {
                    const ok = await addToWishlist(productData._id)
                    if (ok) {
                      setWishlistPulse(true)
                      setTimeout(() => setWishlistPulse(false), 350)
                    }
                  }
                }}
                className={`absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-md transition-all ${isWishlisted ? 'text-blue-500 scale-110' : 'text-gray-400 dark:text-white hover:text-blue-500'} ${wishlistPulse ? 'scale-125' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className='dark:invert-0'>
                  <path d="M12 21s-7-4.35-9.33-8.02C.5 9.52 1.24 6.4 3.64 4.9a5.06 5.06 0 0 1 5.58.3L12 7.35l2.78-2.15a5.06 5.06 0 0 1 5.58-.3c2.4 1.5 3.14 4.62.97 8.08C19 16.65 12 21 12 21z" />
                </svg>
              </button>
          </div>
        </div>

        {/* -------- Product Details ---------- */}
        <div className='flex-1 flex flex-col justify-center'>
          
          <div className='mb-2'>
            <p className='text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest'>{productData.category} / {productData.subCategory}</p>
            <h1 className='text-3xl font-semibold text-gray-800 dark:text-gray-100 mt-2'>{productData.name}</h1>
          </div>

          <div className='mt-5'>
            <p className='text-3xl font-semibold text-gray-800 dark:text-gray-100'>{currency}{productData.price}</p>
          </div>

          <div className='flex flex-col gap-4 my-8'>
              <p className='text-gray-700 dark:text-gray-200 font-medium'>
                {productData.category === 'Beauty' ? `Select ${productData.measurementType || 'Option'}` : 'Select Size'}
              </p>
              <div className='flex gap-2 flex-wrap'>
                {(productData.category === 'Beauty' ? (productData.values || []) : (productData.sizes || [])).map((item, index) => (
                    <button 
                      onClick={() => setSize(item)} 
                      className={`px-4 py-2 border rounded-md transition-all ${item === size ? 'border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-900/20' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-transparent dark:border-zinc-700'}`} 
                      key={index}
                    >
                      {item}{productData.category === 'Beauty' && productData.measurementType !== 'qty' ? productData.measurementType : ''}
                    </button>
                ))}
              </div>
          </div>

          <div className='space-y-4'>
            <button
              onClick={()=>{
                if (!token) {
                  navigate('/login')
                  return
                }
                if (size) {
                  addToCart(productData._id,size)
                  setAddedPulse(true)
                  setTimeout(()=>setAddedPulse(false), 300)
                }
              }}
              disabled={token ? !size : false}
              className={`w-full sm:w-auto px-12 py-3 text-sm font-semibold transition-all ${token && !size ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'btn-primary active:scale-105 shadow-lg'} ${addedPulse ? 'bg-green-600 dark:bg-green-700' : ''}`}
            >
              {addedPulse ? 'ADDED' : 'ADD TO CART'}
            </button>
            
            {token && !size && (
              <p className='text-xs text-sky-600 font-medium'>
                 Please select {productData.category === 'Beauty' ? (productData.measurementType || 'measurement') : 'a size'} to continue.
              </p>
            )}
          </div>

          {/* Description Section with Read More Toggle */}
          <div className='mt-10 border-t dark:border-zinc-800 pt-8'>
            <p className='text-sm font-bold text-gray-800 dark:text-gray-100 mb-2 uppercase tracking-wide'>Description</p>
            <div className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-h-[400px] overflow-y-auto no-scrollbar'>
               {productData.description.length > 200 && !readMore 
                 ? `${productData.description.slice(0, 200)}... ` 
                 : productData.description
               }
               {productData.description.length > 200 && (
                 <button 
                   onClick={() => setReadMore(!readMore)} 
                   className='text-sky-600 font-medium hover:underline focus:outline-none ml-1'
                 >
                   {readMore ? 'Read Less' : 'Read More'}
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className='mt-20 pb-10'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
