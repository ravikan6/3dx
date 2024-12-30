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
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
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
          <h2 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-xl">Discover our exclusive collection</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative group">
                <motion.img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-72 object-cover group-hover:blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <Link
                      href="/ProductPg"
                      className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Shop Now
                    </Link>
                  </div>
                </motion.div>
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
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    ${product.price?.toFixed(2)}
                  </motion.span>
                  <div className="flex items-center bg-yellow-50/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-yellow-500 text-lg">★★★★★</span>
                  </div>
                </motion.div>

                <Link
                  href="/ProductPg"
                  className="block w-full text-black text-center px-6 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold hover:from-gray-800 hover:to-gray-600 backdrop-blur-sm"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
         
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;