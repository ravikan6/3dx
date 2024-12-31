'use client';

import React, { useState } from "react";
import { Box } from "lucide-react";
import Link from "next/link";
import { RiShoppingCart2Line, RiUser3Line, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = 3; // Example cart item count

  const navigationLinks = [
    { name: "Products", href: "/shop" },
    { name: "Creators", href: "/creators" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:scale-105 transition-transform"
          aria-label="Homepage"
        >
          <Box className="h-8 w-8" />
          <span>3D.xyz</span>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-gray-700 hover:text-gray-900 transition-transform hover:scale-105 text-center"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-gray-900 transition-transform hover:scale-110"
            aria-label="View cart"
          >
            <RiShoppingCart2Line className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          <Link
            href="/profile"
            className="text-gray-700 hover:text-gray-900 transition-transform hover:scale-110"
            aria-label="View profile"
          >
            <RiUser3Line className="w-6 h-6" />
          </Link>

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none transition-transform hover:scale-110"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenuLine className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md"
          >
            <nav className="flex flex-col items-center py-4 space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-gray-900 transition-transform hover:scale-105 text-center"
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;