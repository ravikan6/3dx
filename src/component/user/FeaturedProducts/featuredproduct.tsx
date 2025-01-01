'use client';

import React from 'react';
import Link from 'next/link';
import { featuredProducts } from '@/data/productdetails';
import { motion } from 'framer-motion';

export function FeaturedProducts() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-7xl font-extrabold text-white bg-clip-text text-transparent mb-4">
            Featured Products
          </h2>
          <p className="text-gray-500 text-3xl">Discover our exclusive collection</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredProducts.map((product) => (
            <Link href="/shop" key={product.id} passHref>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <div className="relative group">
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                  <p className="text-gray-600 flex-1 mb-4">{product.description}</p>

                  <motion.div
                    className="flex justify-between items-center mb-6 bg-gray-50/50 backdrop-blur-sm p-4 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span
                      className="text-3xl font-bold text-gray-900"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      ₹{product.price?.toFixed(2)}
                    </motion.span>
                    <div className="flex items-center bg-yellow-50/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-yellow-500 text-lg">★★★★★</span>
                    </div>
                  </motion.div>

                  <div className="block w-full text-center">
                    <div className="text-white bg-black px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300">
                      View Details
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Placeholder for any additional content */}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;