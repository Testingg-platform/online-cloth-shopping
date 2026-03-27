import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    },[location])
    
  return showSearch && visible ? (
    <div className='border-t border-b bg-white/60 dark:bg-black/60 dark:border-zinc-800 text-center'>
      <div className='inline-flex items-center justify-center border border-blue-200 dark:border-zinc-700 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 bg-white dark:bg-zinc-900'>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm text-gray-700 dark:text-gray-200' type="text" placeholder='Search'/>
        <img className='w-4 dark:invert' src={assets.search_icon} alt="" />
      </div>
      <button className='inline-flex items-center justify-center' aria-label="Close search" onClick={()=>setShowSearch(false)}>
        <img className='w-3 dark:invert' src={assets.cross_icon} alt="" />
      </button>
    </div>
  ) : null
}

export default SearchBar
