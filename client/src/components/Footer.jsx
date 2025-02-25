import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
   <footer className='border-t' >
      <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
        <p>© All Rights Reserved 2025</p>

        <div className='social-icons flex items-center gap-4 justify-center text-2xl'>
          <a href='' className='fb'>
            <FaFacebook/>
          </a>
          <a href='' className='ig'>
            <FaInstagram/>
          </a>
          <a href='' className='x'>
            <FaXTwitter/>
          </a>
        </div>
      </div>
   </footer>
  )
}

export default Footer
