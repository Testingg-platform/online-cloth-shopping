import React, { useState, useEffect } from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className='admin-topbar flex items-center py-4 px-[4%] justify-between'>
        <div className='flex items-center gap-3'>
          <img className='w-[max(10%,80px)] dark:invert' src={assets.logo} alt="" />
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-100'>Forever Admin</p>
            <p className='text-xs text-gray-400 dark:text-gray-500'>Control center</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <button 
            onClick={toggleTheme} 
            className='p-2 flex items-center justify-center transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800'
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
            )}
          </button>
          <button onClick={()=>setToken('')} className='admin-cta text-xs sm:text-sm'>Logout</button>
        </div>
    </div>
  )
}

export default Navbar
