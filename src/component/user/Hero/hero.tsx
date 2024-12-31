'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
    {/* Background Section */}
    <div className="absolute inset-0">
      <motion.img
        src="https://images.unsplash.com/photo-1670311822096-fcbb0fbd1279?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="3D Printing Background"
        className="h-full w-full object-cover opacity-30"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>

    {/* Content Section */}
    <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <motion.div
          className="space-y-6 max-w-2xl"
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl font-dm-sans text-white">
          
            <span className="text-gray-300"> Transform Your Space with 3D Printed Art</span>
          </h1>
          <p className="text-xl text-gray-400">
            Discover unique, customizable 3D-printed designs that bring innovation and creativity to your home.
          </p>
          <div className="flex gap-4">
            {/* <motion.button
              onClick={handleShopNowClick}
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-all hover:bg-gray-700 hover:text-white"
              whileHover={{ scale: 1.1 }}
            >
              Shop Now
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.button> */}
            <motion.button
              className="rounded-full border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-white hover:text-black"
              whileHover={{ scale: 1.1 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
  );
}

export default Hero;