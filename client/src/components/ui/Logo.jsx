import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/navbar logo.jpeg';

const Logo = ({ className = '', light = false }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img src={logoImg} alt="VMANOUS Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
    </Link>
  );
};

export default Logo;
