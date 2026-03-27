import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Edit from './pages/Edit'
import Users from './pages/Users'
import Category from './pages/Category'
import SubCategory from './pages/SubCategory'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='admin-shell h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <div className='flex w-full min-h-screen overflow-hidden'>
            <Sidebar setToken={setToken} />
            <main className='flex-1 overflow-y-auto p-6 h-screen'>
              <div className='max-w-[1200px] mx-auto pt-4 text-gray-700 text-base'>
                <Routes>
                  <Route path='/' element={<Navigate to="/dashboard" replace />} />
                  <Route path='/dashboard' element={<Dashboard token={token} />} />
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/list' element={<List token={token} />} />
                  <Route path='/edit/:id' element={<Edit token={token} />} />
                  <Route path='/orders' element={<Orders token={token} />} />
                  <Route path='/users' element={<Users token={token} />} />
                  <Route path='/category' element={<Category token={token} />} />
                  <Route path='/subcategory' element={<SubCategory token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
          <div className='px-[4%] pb-8 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2'>
            <span>Crafted with care for a smoother admin flow.</span>
            <a href='/privacy-policy' target='_blank' rel='noopener noreferrer' className='hover:text-gray-600 underline'>Privacy Policy</a>
          </div>
        </>
      }
    </div>
  )
}

export default App
