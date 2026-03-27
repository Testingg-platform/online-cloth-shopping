import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useSearchParams } from 'react-router-dom';

const Collection = () => {

  const { products , search , showSearch, setSearch, categories, subCategories } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [priceRange,setPriceRange] = useState([]);
  const [sortType,setSortType] = useState('relevant')
  const [idealFor,setIdealFor] = useState([]);

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const togglePrice = (e) => {
    if (priceRange.includes(e.target.value)) {
      setPriceRange(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setPriceRange(prev => [...prev,e.target.value])
    }
  }

  const toggleIdealFor = (e) => {
    if (idealFor.includes(e.target.value)) {
      setIdealFor(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setIdealFor(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    if (priceRange.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const price = item.price;
        return priceRange.some(range => {
          switch(range) {
            case 'below100':
              return price < 100;
            case '100to500':
              return price >= 100 && price <= 500;
            case '501to1000':
              return price >= 501 && price <= 1000;
            case 'above1000':
              return price > 1000;
            default:
              return true;
          }
        });
      });
    }

    if (idealFor.length > 0) {
      productsCopy = productsCopy.filter(item => idealFor.includes(item.targetAudience));
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((b,a)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,priceRange,idealFor,search,showSearch,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory([categoryParam]);
      setShowFilter(true);
    }
  }, [searchParams])

  return (
    <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t'>
      
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 text-gray-800 dark:text-gray-100'>FILTERS
          <img className={`h-3 sm:hidden dark:invert ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter */}
        <div className={`glass pl-5 py-4 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium dark:text-gray-200'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
            {categories.map((item, index) => (
              <p key={index} className='flex gap-2 text-gray-600 dark:text-gray-400'>
                <input className='w-3' type="checkbox" value={item.name} onChange={toggleCategory} checked={category.includes(item.name)} /> {item.name}
              </p>
            ))}
          </div>
        </div>
        {/* SubCategory Filter */}
        {category.length > 0 && (
          <div className={`glass pl-5 py-4 my-5 ${showFilter ? '' :'hidden'} sm:block transition-all duration-300`}>
            <p className='mb-3 text-sm font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200'>Type</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
              {Array.from(new Set(subCategories
                .filter(item => category.includes(item.categoryId?.name))
                .map(item => item.name)))
                .map((subName, index) => (
                <p key={index} className='flex gap-2 text-gray-600 dark:text-gray-400 font-normal'>
                  <input className='w-3 cursor-pointer' type="checkbox" value={subName} onChange={toggleSubCategory} checked={subCategory.includes(subName)} /> {subName}
                </p>
              ))}
            </div>
          </div>
        )}
        {/* Ideal For Filter */}
        {category.includes("Beauty") && (
          <div className={`glass pl-5 py-4 my-5 ${showFilter ? '' :'hidden'} sm:block transition-all duration-300`}>
            <p className='mb-3 text-sm font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200'>Ideal For</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
              {["Men", "Women", "Kids", "Unisex"].map((item, index) => (
                <p key={index} className='flex gap-2 text-gray-600 dark:text-gray-400 font-normal'>
                  <input className='w-3 cursor-pointer' type="checkbox" value={item} onChange={toggleIdealFor} checked={idealFor.includes(item)} /> {item}
                </p>
              ))}
            </div>
          </div>
        )}
        {/* Price Filter */}
        <div className={`glass pl-5 py-4 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium dark:text-gray-200'>PRICE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'below100'} onChange={togglePrice}/> Below 100
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'100to500'} onChange={togglePrice}/> 100 to 500
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'501to1000'} onChange={togglePrice}/> 501 to 1000
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'above1000'} onChange={togglePrice}/> 1000 and above
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-3 items-center'>
            <Title 
              text1={category.length === 1 ? category[0].toUpperCase() : (subCategory.length === 1 ? subCategory[0].toUpperCase() : 'ALL')} 
              text2={category.length === 1 || subCategory.length === 1 ? 'COLLECTION' : 'COLLECTIONS'} 
            />
            {/* Porduct Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='soft-input text-sm px-3'>
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
        </div>

        {(category.length > 0 || subCategory.length > 0 || priceRange.length > 0 || (showSearch && search)) && (
          <div className='flex flex-wrap items-center gap-2 mb-4 text-xs'>
            {showSearch && search && (
              <button
                className='chip text-gray-700 dark:text-gray-300'
                onClick={() => setSearch('')}
              >
                Search: {search} ✕
              </button>
            )}
            {category.map((cat) => (
              <button
                key={cat}
                className='chip text-gray-700 dark:text-gray-300'
                onClick={() => setCategory(prev => prev.filter(item => item !== cat))}
              >
                {cat} ✕
              </button>
            ))}
            {subCategory.map((sub) => (
              <button
                key={sub}
                className='chip text-gray-700 dark:text-gray-300'
                onClick={() => setSubCategory(prev => prev.filter(item => item !== sub))}
              >
                {sub} ✕
              </button>
            ))}
            {priceRange.map((range) => (
              <button
                key={range}
                className='chip text-gray-700 dark:text-gray-300'
                onClick={() => setPriceRange(prev => prev.filter(item => item !== range))}
              >
                {range === 'below100' ? 'Below 100' : range === '100to500' ? '100 to 500' : range === '501to1000' ? '501 to 1000' : '1000 and above'} ✕
              </button>
            ))}
            {idealFor.map((ideal) => (
              <button
                key={ideal}
                className='chip text-gray-700 dark:text-gray-300'
                onClick={() => setIdealFor(prev => prev.filter(item => item !== ideal))}
              >
                Ideal for: {ideal} ✕
              </button>
            ))}
          </div>
        )}

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item)=>(
              <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Collection
