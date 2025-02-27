import React from 'react'
import nobglogo from '../assets/nobglogo.png'
import Search from '../components/Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegUserCircle,  } from "react-icons/fa"
import { BsCart4 } from "react-icons/bs"
import { useMobile } from '../hooks/useMobile'

const Header = () => {
  const [isMobileScreen] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()

  const isSearchPage = location.pathname === "/product-search"

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  return (
    <header className='h-35 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-2 bg-white'>
      {
        !(isSearchPage && isMobileScreen) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>
            <div className='h-full'>
              <Link to={"/"} className='h-full flex justify-center items-center'>
                <img src={nobglogo} width={70} height={70} alt='logo' className='hidden lg:block' />
                <img src={nobglogo} width={60} height={60} alt='logo' className='lg:hidden' />
              </Link>
            </div>

            <div className='hidden lg:block'>
              <Search />
            </div>

            <div className=''>
              {/** user icon only for mobile version */}
              <button className='tex-neutral-600 lg:hidden'>
                <FaRegUserCircle size={25} />
              </button>
              <div className='hidden lg:flex items-center gap-10'>
               <button onClick={redirectToLoginPage} className='tex-lg px-2'> Login </button> 
               <button className='flex items-center 
                                  gap-2 bg-green-800
                                  hover:bg-green-700
                                  px-3 py-3 rounded
                                  text-white'>
                <div className='animate-bounce'>
                  <BsCart4 size={28} />
                </div>
                <div className='font-semibold'>
                  <p>My Cart</p>
                </div>
                {/* <div>
                  <p>1 items</p>
                  <p>100/-</p>
                </div> */}
               </button>
              </div>
            </div>
          </div>
        )
      }

      <div className='container mx-auto px-2 lg:hidden'>
        <Search />
      </div>
    </header>
  )
}

export default Header
