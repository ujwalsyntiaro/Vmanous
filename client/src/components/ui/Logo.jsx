import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', light = false }) => {
  return (
    <a 
      href="/" 
      style={{ fontFamily: "'Baloo 2', cursive, sans-serif", fontWeight: 800 }}
      className={`inline-flex items-center text-2xl md:text-3xl tracking-wider select-none text-[#45BF64] ${className}`}
    >
      VMANOUS
    </a>
  );
};

export default Logo;
