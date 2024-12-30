'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="w-full bg-white pt-16 pb-12 md:pt-24 md:pb-24"> {/* Adjusted padding */}
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover elegant & affordable furniture for every room
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Transform your home with sophisticated and stylish pieces. Curated selection for a seamless and inviting home.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <a
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Shop now
              </a>
              <a
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Learn more
              </a>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center gap-4">
            <motion.div
              className="overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                alt="Modern chair"
                className="aspect-[1/1] object-cover"
                height="400"
                src="/placeholder.svg"
                width="400"
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  alt="Stylish lamp"
                  className="aspect-[1/1] object-cover"
                  height="200"
                  src="/placeholder.svg"
                  width="200"
                />
              </motion.div>
              <motion.div
                className="overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Image
                  alt="Modern sofa"
                  className="aspect-[1/1] object-cover"
                  height="200"
                  src="/placeholder.svg"
                  width="200"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
