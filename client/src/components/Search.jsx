import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5"
import { IoArrowBack } from "react-icons/io5"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { useMobile } from '../hooks/useMobile'

const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [isSearchPage, setIsSearchPage] = useState(false)

  const [isMobileScreen] = useMobile()

  useEffect(() => {
    const isSearch = location.pathname === "/product-search"
    setIsSearchPage(isSearch)
  }, [location])

  const redirectToSearchPage = () => {
    navigate("/product-search")
  }

  return (
    <div className='w-full min-w-[300px] 
                    lg:min-w-[420px] 
                    h-11 lg:h-12 rounded-lg 
                    border-[0.5px] 
                    border-gray-300 overflow-hidden
                    flex items-center
                    text-neutral-500 bg-slate-100 
                    group focus-within:border-amber-300'>
      <div>
        {
          (isMobileScreen && isSearchPage) ? (
            <Link to="/" className='flex justify-center 
                                    items-center 
                                    h-full p-2 m-1
                                    text-neutral-700 
                                    group-focus-within:text-amber-300 
                                    bg-white rounded-full 
                                    shadow-md'>
              <IoArrowBack size={20} />
            </Link>
          ) : (
            <button className='flex justify-center 
                         items-center 
                         h-full p-3 
                         text-neutral-700 
                         group-focus-within:text-amber-300'>
              <IoSearchSharp size={20} />
            </button>
          )
        }


      </div>
      <div className='w-full h-full'>
        {
          !isSearchPage ? (
            <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
              <TypeAnimation
                sequence={[
                  'Search "eggs"',
                  1000,
                  'Search "apple"',
                  1000,
                  'Search "cheese"',
                  1000,
                  'Search "chips"',
                  1000,
                  'Search "milk"',
                  1000,
                  'Search "butter"',
                  1000,
                  'Search "rice"',
                  1000,
                  'Search "coke"',
                  1000
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
              />
            </div>
          ) : (
            <div className='w-full h-full'>
              <input
                type='text'
                placeholder='Search'
                autoFocus='true'
                className='bg-transparent w-full h-full outline-none'
              />
            </div>
          )
        }
      </div>

    </div>
  )
}

export default Search
