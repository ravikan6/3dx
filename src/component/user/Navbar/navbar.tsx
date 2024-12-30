import React, { useState } from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiShoppingCart2Line, RiUser3Line } from "react-icons/ri";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname(); // Use usePathname for current path
  const cartItemCount = 3; // Example cart item count

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const isActive = (path: string) => pathname === path; // Compare with pathname

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold hover:underline transition transform hover:scale-105"
        >
          <Box className="h-8 w-8 text-gray-900" />
          <span>3D.xyz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 text-gray-700 sm:block">
          <Link
            href="/Productpg"
            className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
              isActive("/Productpg") ? "underline font-semibold" : ""
            }`}
          >
            Products
          </Link>
          <a
            href="#"
            className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline`}
          >
            Creators
          </a>
          <Link
            href="/about"
            className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
              isActive("/about") ? "underline font-semibold" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/Contact"
            className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
              isActive("/Contact") ? "underline font-semibold" : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-gray-900 transition transform hover:scale-105"
          >
            <RiShoppingCart2Line className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button
              className="text-gray-700 hover:text-gray-900 transition transform hover:scale-105"
              onClick={toggleProfileDropdown}
            >
              <RiUser3Line className="w-6 h-6" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Signup
                </Link>
                <Link
                  href="/seller-login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Seller Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-gray-900 focus:outline-none transition-transform hover:scale-110"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden bg-white/90 backdrop-blur-md shadow-md"
        >
          <nav className="flex flex-col items-center py-4 space-y-4 text-gray-700">
            <Link
              href="/Productpg"
              className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
                isActive("/Productpg") ? "underline font-semibold" : ""
              }`}
              onClick={toggleMenu}
            >
              Products
            </Link>
            <a
              href="#"
              className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline`}
              onClick={toggleMenu}
            >
              Creators
            </a>
            <Link
              href="/about"
              className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
                isActive("/about") ? "underline font-semibold" : ""
              }`}
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`hover:text-gray-900 transition transform hover:scale-105 hover:underline ${
                isActive("/Contact") ? "underline font-semibold" : ""
              }`}
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;
