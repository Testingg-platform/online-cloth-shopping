import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'

const listIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-500 dark:text-white' fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 7h14M5 11h14M5 15h14M5 19h14" />
  </svg>
)

const usersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-500 dark:text-white' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const dashboardIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-500 dark:text-white' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const Sidebar = ({ setToken }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation()
  const isListActive = ['/list', '/add'].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith('/edit')
  const linkBase = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all border shadow-sm'
  const inactive = 'border-transparent text-gray-600 dark:text-zinc-400 hover:bg-[#eef6ff] dark:hover:bg-zinc-800'
  const active = 'border-[#7aa6ff] bg-[#eaf2ff] dark:bg-zinc-800 text-gray-800 dark:text-white'

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className='admin-sidebar w-[18%] h-screen sticky top-0 self-start'>
      <div className='flex h-screen flex-col px-[12%] py-6 text-[15px]'>
        <div className='mb-6'>
          <div className='p-3 flex flex-col items-start gap-2'>
            <img className='w-24 dark:invert' src={assets.logo} alt='Forever Admin' />
            <div>
              <p className='text-base font-semibold text-gray-800 dark:text-gray-100'>Forever Admin</p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>Control center</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3 flex-1'>
          <NavLink className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`} to="/dashboard">
            {dashboardIcon}
            <p className='hidden md:block font-medium'>Dashboard</p>
          </NavLink>
          <NavLink className={() => `${linkBase} ${isListActive ? active : inactive}`} to="/list">
            {listIcon}
            <p className='hidden md:block font-medium'>Products</p>
          </NavLink>


          <NavLink className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`} to="/category">
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-500 dark:text-white' fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className='hidden md:block font-medium'>Categories</p>
          </NavLink>

          <NavLink className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`} to="/subcategory">
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 text-gray-500 dark:text-white' fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <p className='hidden md:block font-medium'>Sub Categories</p>
          </NavLink>

          <NavLink className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`} to="/users">
            {usersIcon}
            <p className='hidden md:block font-medium'>Users</p>
          </NavLink>

          <NavLink className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`} to="/orders">
            <img className='w-5 h-5 dark:invert' src={assets.parcel_icon} alt="" />
            <p className='hidden md:block font-medium'>Orders</p>
          </NavLink>

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent text-gray-600 dark:text-zinc-400 hover:bg-[#eef6ff] dark:hover:bg-zinc-800 transition-all"
            >
              <span className="font-medium hidden md:block">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
              )}
            </button>
            <button
              type='button'
              onClick={() => setToken('')}
              className='admin-cta admin-cta-sm w-full px-4 py-3'
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar
