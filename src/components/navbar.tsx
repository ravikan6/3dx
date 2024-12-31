'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RiShoppingCart2Line, RiUser3Line, RiMenuLine, RiCloseLine, RiLoginBoxLine, RiUserAddLine, RiStore2Line } from 'react-icons/ri';
import { Box } from './Box';
import { UserDropdown } from './UserDropdown';
import type { NavbarProps, NavigationLink } from '@/types/navbar';

const navigationLinks: NavigationLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Shop', href: '/shop' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar({ cartItemCount = 0, isMenuOpen, toggleMenu }: NavbarProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-black backdrop-blur-sm border-b border-gray-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-medium text-white hover:scale-105 transition-all duration-300 ease-out"
            aria-label="Homepage"
          >
            <Box className="text-white/90" />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">3D.xyz</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative px-3 py-2"
              >
                <span className="relative z-10 text-gray-300 transition-colors duration-300 group-hover:text-white">
                  {link.name}
                </span>
                <motion.span
                  className="absolute inset-0 z-0 h-full w-full rounded-lg bg-white/0"
                  whileHover={{
                    scale: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
                  }}
                  initial={{ scale: 0.75 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="group relative text-gray-300 transition-colors duration-300 hover:text-white"
              aria-label="View cart"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <RiShoppingCart2Line className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    {cartItemCount}
                  </span>
                )}
              </motion.div>
            </Link>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="text-gray-300 hover:text-white focus:outline-none"
                onClick={toggleUserDropdown}
                aria-label="User menu"
              >
                <RiUser3Line className="w-6 h-6" />
              </motion.button>
              <UserDropdown isOpen={isUserDropdownOpen} onClose={() => setIsUserDropdownOpen(false)} />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <RiCloseLine className="w-6 h-6" />
              ) : (
                <RiMenuLine className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-800/50"
          >
            <nav className="flex flex-col items-center py-4 space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative px-4 py-2 text-gray-300 transition-colors duration-300 hover:text-white"
                  onClick={toggleMenu}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.span
                    className="absolute inset-0 z-0 h-full w-full rounded-lg bg-white/0"
                    whileHover={{
                      scale: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    initial={{ scale: 0.75 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

