import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { RiLoginBoxLine, RiUserAddLine, RiStore2Line, RiUser3Line, RiFileList3Line, RiLogoutBoxRLine } from 'react-icons/ri';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function UserDropdown({ isOpen, onClose, isLoggedIn, onLogout }: UserDropdownProps) {
  const loggedOutItems = [
    { name: 'Login', href: '/login', icon: RiLoginBoxLine },
    { name: 'Sign Up', href: '/signup', icon: RiUserAddLine },
    { name: 'Seller', href: '/seller', icon: RiStore2Line },
  ];

  const loggedInItems = [
    { name: 'My Profile', href: '/profile', icon: RiUser3Line },
    { name: 'My Orders', href: '/orders', icon: RiFileList3Line },
    { name: 'Logout', href: '#', icon: RiLogoutBoxRLine, onClick: onLogout },
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
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
                onClose();
              }}
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

