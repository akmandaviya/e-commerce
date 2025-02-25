import React from 'react'
import logo from '../assets/logo.png'
import Search from '../components/Search'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='h-20 shadow-md sticky top-0'>
      <div className='container mx-auto flex items-center h-full px-2 justify-between'> 
        <div className='h-full'>
          <Link to={"/"} className='h-full flex justify-center items-center'>
            <img src={logo} width={70} height={70} alt='logo' className='hidden lg:block'/>
            <img src={logo} width={60} height={60} alt='logo' className='lg:hidden'/>
          </Link>
        </div>

        <div>
          <Search/>
        </div>

        <div>
          Login and cart
        </div>
      </div>
    </header>
  )
}

export default Header
