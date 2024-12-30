'use client';

import React from 'react';
import Link from 'next/link';
import { featuredProducts } from '@/data/productdetails';

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-white px-8">
      <h2 className="text-5xl font-bold text-left text-black mb-8">Featured Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredProducts.map((product:any, index:any) => (
          <div
            key={index}
            className={`bg-black shadow-lg rounded-lg overflow-hidden relative ${
              index % 3 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 sm:h-64 lg:h-72 object-cover rounded-t-lg"
            />

            {/* Black Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>

            {/* Product Name and Shop Button Section */}
            <div className="absolute bottom-4 left-4 z-20">
              {/* Product Name with Hover Underline */}
              <h3 className="text-lg sm:text-xl font-semibold text-white group relative cursor-pointer">
                {product.title}
                <span className="absolute left-0 bottom-0 block w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </h3>

              {/* Shop Button with Hover Underline */}
              <Link
                href='/Productpg'
                className="block mt-4 text-center bg-black text-white px-4 py-2 rounded-lg transition-all hover:bg-gray-700 relative group"
              >
                Shop Now
                <span className="absolute left-0 bottom-0 block w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}