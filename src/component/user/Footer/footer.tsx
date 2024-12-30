'use client';

import React from 'react';
import { Box } from 'lucide-react';
import Link from 'next/link';
import { NewsletterForm } from './newsletter';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
              <Box className="h-8 w-8 text-blue-400" />
              <span>3D.xyz</span>
            </div>
            <p className="mt-4 text-gray-400">
              Transforming spaces with innovative 3D-printed designs.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-gray-400">
              {['Products', 'Creators', 'About Us', 'Contact'].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ scale: 1.05, color: '#3b82f6' }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-400">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-gray-400">
              {['FAQ', 'Shipping', 'Returns', 'Track Order'].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ scale: 1.05, color: '#3b82f6' }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-400">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="mt-4 text-gray-400">
              Subscribe to get updates on new products and special offers.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>

        {/* Footer Bottom Section */}
      
      </div>
    </footer>
  );
}
