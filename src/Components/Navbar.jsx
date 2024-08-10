import React from 'react';
import { FaBars } from 'react-icons/fa';
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div>
        <FaBars 
          className="w-8 h-auto" // Adjust the width as needed
        />
      </div>
      <div className='w-fit z-0 flex items-center' style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 'bold' }}>
        <img 
          src="./Assets/logo.svg" 
          alt="logo" 
          className="w-12 h-auto mr-2" // Adjust the width as needed
        />
        <span className="text-black">
          <span className="text-red-600 text-4xl">U</span>ltimate
          <span className="text-red-600 text-4xl">F</span>ight
          <span className="text-red-600 text-4xl">C</span>hronicles
        </span>
      </div>
      <div>
        <FaSearch
          className="w-8 h-auto"     
        />
      </div>
    </div>
  );
}

export default Navbar;
