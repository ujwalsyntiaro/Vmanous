import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import Logo from '../ui/Logo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'AI Summit', path: '/ai-summit' },
  { name: 'Data Science', path: '/data-science' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'About Us', path: '/about' },
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
            <div className="flex-1 flex justify-start">
              <Logo />
            </div>

            {/* CENTER: Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-vmanous-navy-deep relative group outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green focus-visible:ring-offset-4 rounded-sm ${isActive ? 'text-vmanous-navy-dark' : 'text-gray-500'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vmanous-green rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Action Button */}
            <div className="hidden md:flex items-center justify-end flex-1">
              <NavLink
                to="/enroll"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-vmanous-green relative group outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green rounded-sm ${
                    isActive ? 'text-vmanous-green' : 'text-vmanous-navy-dark'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Enroll Now
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vmanous-green rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-vmanous-navy-dark rounded-md hover:bg-gray-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green ml-auto"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
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
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-[60] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <Logo />
                <button
                  className="p-2 text-gray-500 rounded-md hover:bg-gray-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-5 flex flex-col space-y-6">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green rounded-sm px-2 py-1 -mx-2 ${isActive ? 'text-vmanous-green' : 'text-vmanous-navy-dark'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>

                <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                  <NavLink
                    to="/enroll"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green rounded-sm px-2 py-1 -mx-2 ${
                        isActive ? 'text-vmanous-green' : 'text-vmanous-navy-dark hover:text-vmanous-green'
                      }`
                    }
                  >
                    Enroll Now
                  </NavLink>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
