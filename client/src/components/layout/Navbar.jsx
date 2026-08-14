import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import Logo from '../ui/Logo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'AI Summit', path: '/ai-summit' },
  { name: 'Data Science', path: '/data-science' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Blog', path: '/blog' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-1.5'
          : 'bg-white py-2 border-b border-gray-100'
          }`}
      >
        <Container className="!max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <div className="flex-1 flex justify-start items-center">
              <Logo />
            </div>

            {/* CENTER: Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-vmanous-navy-deep relative outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green focus-visible:ring-offset-4 rounded-sm ${isActive ? 'text-vmanous-green font-semibold' : 'text-gray-500'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Spacing placeholder for balanced nav centering */}
            <div className="hidden md:flex items-center justify-end flex-1" />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-vmanous-navy-dark transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green ml-auto bg-transparent group"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="14" y2="16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-vmanous-navy-dark/40 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[220px] bg-white z-[60] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <Logo />
                <button
                  className="p-2 text-vmanous-navy-dark transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green bg-transparent group"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pt-2 pb-6 px-5 flex flex-col space-y-6">
                <nav className="flex flex-col">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green py-2 border-b border-gray-100 ${isActive ? 'text-vmanous-green' : 'text-vmanous-navy-dark hover:text-vmanous-green'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
