import React, { useContext, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios'

const Navbar = () => {

  const [visible, setVisible] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setWishlistItems, products, backendUrl } = useContext(ShopContext);

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
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [backendUrl]);

  const preferredOrder = ['Men', 'Women', 'Kids'];
  const sidebarCategories = [
    ...preferredOrder.filter(cat => categories.some(c => c.name === cat)),
    ...categories.filter(c => !preferredOrder.includes(c.name)).map(c => c.name),
  ];
  const [sidebarUserName, setSidebarUserName] = useState('');

  const getUserName = () => {
    if (!token) return '';
    try {
      const payload = token.split('.')[1];
      if (!payload) return '';
      const decoded = JSON.parse(atob(payload));
      return decoded.name || decoded.username || decoded.email?.split('@')[0] || '';
    } catch (error) {
      return '';
    }
  };
  const userName = getUserName();

  useEffect(() => {
    let isActive = true;
    const loadProfileName = async () => {
      if (!token) {
        setSidebarUserName('');
        return;
      }
      try {
        const response = await axios.get(backendUrl + '/api/user/profile', {
          headers: { token }
        });
        if (!isActive) return;
        if (response.data?.success) {
          const name = response.data.user?.name || response.data.user?.email || '';
          setSidebarUserName(name);
        }
      } catch (error) {
        if (!isActive) return;
        setSidebarUserName('');
      }
    };

    loadProfileName();

    return () => {
      isActive = false;
    };
  }, [token, backendUrl]);

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (visible) {
      body.classList.add('overflow-hidden');
      root.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
      root.classList.remove('overflow-hidden');
    }
    return () => {
      body.classList.remove('overflow-hidden');
      root.classList.remove('overflow-hidden');
    };
  }, [visible]);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setWishlistItems([])
  }

  const sidebarUi = (
    <div className={`fixed inset-0 z-[500] lg:hidden transition-opacity ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300' onClick={() => setVisible(false)} />
      <div className={`absolute top-0 right-0 h-screen w-[86%] max-w-[340px] bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-l border-blue-100 dark:border-zinc-800 rounded-l-3xl overflow-hidden transform transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='h-full flex flex-col overflow-y-auto text-gray-700 dark:text-gray-300'>
          <div className='flex items-center justify-between p-4 border-b border-blue-100 dark:border-zinc-800 bg-white/70 dark:bg-black/70 rounded-tl-3xl'>
            <button onClick={() => { setVisible(false); navigate('/profile') }} className='flex items-center gap-3 text-left w-full'>
              <div className='bg-white dark:bg-zinc-800 rounded-xl p-2 border border-blue-100 dark:border-zinc-700 shadow-sm'>
                <img className='h-4 w-4 invert-0 dark:invert' src={assets.profile_icon} alt='profile' />
              </div>
              <div>
                <p className='text-base font-semibold text-gray-900 dark:text-gray-100'>{token ? `${sidebarUserName || userName || 'User'}` : 'Hello Shopper'}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{token ? 'Go to profile' : 'Login for full experience'}</p>
              </div>
            </button>
            <button aria-label='Close menu' className='btn-ghost p-2' onClick={() => setVisible(false)}>
              <img src={assets.cross_icon} className='h-4 w-4 dark:invert' alt='' />
            </button>
          </div>
          
          <div className='flex items-center justify-between py-3 px-4 border-b border-blue-50'>
            <span className='text-sm font-medium'>Appearance</span>
            <button 
              onClick={toggleTheme} 
              className='btn-ghost p-2 flex items-center justify-center transition-all duration-300'
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <div className='flex items-center gap-2'>
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                  <span className='text-xs'>Dark</span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  <span className='text-xs'>Light</span>
                </div>
              )}
            </button>
          </div>
          <div className='flex flex-col py-2'>
            <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/'>
              <span className='font-medium'>Home</span><span className='text-gray-400'>{'>'}</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/collection'>
              <span className='font-medium'>Collection</span><span className='text-gray-400'>{'>'}</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/about'>
              <span className='font-medium'>About</span><span className='text-gray-400'>{'>'}</span>
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/contact'>
              <span className='font-medium'>Contact</span><span className='text-gray-400'>{'>'}</span>
            </NavLink>
            {token && (
              <>
                <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/wishlist'>
                  <span className='font-medium'>Wishlist</span><span className='text-gray-400'>{'>'}</span>
                </NavLink>
                <NavLink onClick={() => setVisible(false)} className='flex items-center justify-between py-3.5 px-6 border-b border-blue-50 dark:border-zinc-800 hover:bg-blue-50/70 dark:hover:bg-zinc-800/70 text-gray-700 dark:text-gray-300' to='/orders'>
                  <span className='font-medium'>Orders</span><span className='text-gray-400'>{'>'}</span>
                </NavLink>
              </>
            )}
          </div>
          
          <div className='mt-auto p-6'>
            {token ? (
              <button onClick={() => { setVisible(false); logout() }} className='w-full btn-primary py-3 rounded-2xl'>Logout</button>
            ) : (
              <button onClick={() => { setVisible(false); navigate('/login') }} className='w-full btn-primary py-3 rounded-2xl'>Login / Register</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const sidebarPortal = typeof document !== 'undefined' ? createPortal(sidebarUi, document.body) : null

  return (
    <div className='glass flex items-center justify-between py-4 px-4 sm:px-6 mt-4 relative z-50'>

      <Link to='/' className='flex items-center gap-3'>
        <img src={assets.logo} className='w-32 sm:w-36 dark:invert' alt="" />
        <span className='hidden md:block text-xs text-gray-400 tracking-wide'>Everyday essentials</span>
      </Link>

      <ul className='hidden lg:flex gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-black/70 border border-blue-100 dark:border-zinc-800 rounded-full px-3 py-2'>
        <NavLink to='/' className='flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
        </NavLink>

        {!token ? (
          <>
            {categories.map((cat, index) => (
              <NavLink 
                key={index} 
                to={`/collection?category=${encodeURIComponent(cat.name)}`} 
                className={({isActive}) => {
                  const searchParams = new URLSearchParams(window.location.search);
                  const currentCat = searchParams.get('category');
                  const isCatActive = currentCat === cat.name;
                  return `flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800 ${isCatActive ? 'active' : ''}`;
                }}
              >
                <p>{cat.name.toUpperCase()}</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
              </NavLink>
            ))}
            <NavLink
              to='/wishlist'
              onClick={(e) => { if (!token) { e.preventDefault(); navigate('/login') } }}
              className='flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800'
            >
              <p>WISHLIST</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to='/collection' className='flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800'>
              <p>COLLECTION</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
            </NavLink>

            <NavLink to='/about' className='flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800'>
              <p>ABOUT</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-zinc-800'>
              <p>CONTACT</p>
              <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 dark:bg-gray-300 hidden' />
            </NavLink>
          </>
        )}
      </ul>

      <div className='hidden lg:flex items-center gap-5'>
        <button className='btn-ghost px-3 py-2 flex items-center justify-center' aria-label="Search" onClick={() => { setShowSearch(true); navigate('/collection') }}>
          <img src={assets.search_icon} className='w-5 h-5 object-contain shrink-0 invert-0 dark:invert' alt="" />
        </button>

        <button 
          onClick={toggleTheme} 
          className='btn-ghost px-3 py-2 flex items-center justify-center transition-all duration-300'
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
          )}
        </button>

        <div className='group relative'>
          <button
            className='btn-ghost px-3 py-2 flex items-center justify-center'
            aria-label="Profile"
            onClick={() => token ? setIsProfileOpen(v => !v) : navigate('/login')}
          >
            <img
              src={assets.profile_icon}
              className='w-5 h-5 object-contain shrink-0 invert-0 dark:invert'
              alt=""
            />
          </button>
          {/* Dropdown Menu */}
          {token && isProfileOpen &&
            <div className='absolute dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-300 rounded-xl border border-blue-100 dark:border-zinc-700 shadow-xl relative z-[100]'>
                <p onClick={() => { setIsProfileOpen(false); navigate('/profile') }} className='cursor-pointer hover:text-black dark:hover:text-white'>My Profile</p>
                <p onClick={() => { setIsProfileOpen(false); navigate('/wishlist') }} className='cursor-pointer hover:text-black dark:hover:text-white'>Wishlist</p>
                <p onClick={() => { setIsProfileOpen(false); navigate('/orders') }} className='cursor-pointer hover:text-black dark:hover:text-white'>Orders</p>
                <p onClick={() => { setIsProfileOpen(false); logout() }} className='cursor-pointer text-red-500 hover:text-red-600'>Logout</p>
              </div>
            </div>}
        </div>
        <Link to='/cart' className='relative'>
          <button className='btn-primary px-3 py-2' aria-label="Cart">
            <img src={assets.cart_icon} className='w-4 min-w-4 invert-0 dark:invert' alt="" />
          </button>
          <p className='absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 bg-gray-900 dark:bg-blue-500 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
        </Link>
      </div>
      <button className='btn-ghost px-3 py-2 lg:hidden text-gray-700 dark:text-gray-300' aria-label="Open menu" onClick={() => setVisible(true)}>
        <img src={assets.menu_icon} className='w-4 invert-0 dark:invert' alt="" />
      </button>
      {/* Sidebar menu for small screens */}
      {sidebarPortal}

    </div>
  )
}

export default Navbar
