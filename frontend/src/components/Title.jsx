import React from 'react'

const Title = ({text1,text2,className = ''}) => {
  return (
    <div className={`inline-flex gap-2 items-center mb-3 ${className}`}>
      <p className='text-gray-500 dark:text-gray-400 text-xs uppercase tracking-[0.2em]'>{text1} <span className='text-gray-800 dark:text-gray-100 font-semibold text-lg sm:text-xl normal-case tracking-normal'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#5b84f1]'></p>
    </div>
  )
}

export default Title
