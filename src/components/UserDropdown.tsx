import Link from 'next/link';
import { RiLoginBoxLine, RiUserAddLine, RiStore2Line, RiUser3Line, RiFileList3Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface UserDropdownItem {
  name: string;
  href: string;
  icon: React.ElementType;
  onClick?: () => void; // Make onClick optional
}

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function UserDropdown({ isOpen, isLoggedIn, onLogout, onClose }: UserDropdownProps) {
  const loggedOutItems: UserDropdownItem[] = [
    { name: 'Login', href: '/login', icon: RiLoginBoxLine },
    { name: 'Sign Up', href: '/signup', icon: RiUserAddLine },
    { name: 'Seller', href: '/seller', icon: RiStore2Line },
  ];

  const loggedInItems: UserDropdownItem[] = [
    { name: 'My Profile', href: '/profile', icon: RiUser3Line },
    { name: 'My Orders', href: '/orders', icon: RiFileList3Line },
    { name: 'Logout', href: '#', icon: RiLogoutBoxRLine, onClick: onLogout }, // onClick defined here
  ];

  const items = isLoggedIn ? loggedInItems : loggedOutItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
        >
          <div className="py-1">
            {items.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior>
                <a
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    onClose(); // Close the dropdown after click
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Example usage of UserDropdown component
export default function UserDropdownExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Change this based on your authentication logic

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    setIsLoggedIn(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={handleToggleDropdown} className="px-4 py-2 bg-gray-800 text-white rounded-md">
        Profile
      </button>
      <UserDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    </div>
  );
}
