'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { GiftCard } from '@/component/user/GiftComponents/gift-card' // Changed to GiftCard
import { CategoryFilter } from '@/component/user/GiftComponents/category-filter' // Changed to GiftComponents
import { ViewToggle } from '@/component/user/GiftComponents/view-toggle' // Changed to GiftComponents
import { SortGifts } from '@/component/user/GiftComponents/sort-gifts' // Changed to SortGifts
import type { Product } from '@/types/product'

type GiftsResponse = {
  gifts: Product[]; // Renamed to gifts
};

async function getGifts() {
  const response = await fetch('https://backend3dx.onrender.com/product/get-products');
  if (!response.ok) {
    throw new Error('Failed to fetch gifts');
  }
  const data = await response.json();
  console.log(data)
  return data as GiftsResponse; // Changed to GiftsResponse
}

function AnimatedHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden mb-12">
      {/* Background Image */}
      <Image
        src="/hero/lookbook.svg"
        alt="Background"
        className="object-cover"
        fill
        priority
        quality={100}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-full max-w-xl"
        >
          <Image
            src="/hero/GiftShop.svg" // Updated to reflect gifting theme
            alt="Gift Shop"
            width={600}
            height={200}
            className="w-full"
            priority
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2, 
            ease: [0.22, 1, 0.36, 1]
          }}
          className="w-full max-w-xl"
        >
          <Image
            src="/hero/Explore.svg"
            alt="Explore our diverse collection of gifts"
            width={600}
            height={100}
            className="w-full"
          />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-8"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

export default function GiftPage() {
  const [gifts, setGifts] = useState<Product[]>([]); // Changed to gifts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<string>('price-asc');

  useEffect(() => {
    async function loadGifts() { // Changed to loadGifts
      try {
        const data = await getGifts(); // Changed to getGifts
        setGifts(data.gifts); // Changed to gifts
      } catch (err) {
        setError('Failed to load gifts'); // Changed to gifts
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadGifts(); // Changed to loadGifts
  }, [])

  // Get unique categories from all gifts (changed from products to gifts)
  const allCategories = Array.from(
    new Set(gifts.flatMap(gift => gift.categories)) // Changed from products to gifts
  );

  // Filter gifts by selected category (changed from products to gifts)
  const filteredGifts = selectedCategory
    ? gifts.filter(gift => gift.categories.includes(selectedCategory)) // Changed from products to gifts
    : gifts;

  // Sort gifts (changed from products to gifts)
  const sortedGifts = [...filteredGifts].sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.productPrice - b.productPrice;
    } else {
      return b.productPrice - a.productPrice;
    }
  });

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <>
      <AnimatedHero />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Today's Best Gift Deals For You!</h1> {/* Updated text */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
            <CategoryFilter
              categories={allCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="flex gap-4">
              <SortGifts onSortChange={setSortOrder} /> {/* Changed to SortGifts */}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center' : 'flex flex-col gap-6'}>
          {sortedGifts.map((gift) => ( // Changed from products to gifts
            <GiftCard
              key={gift.id} // Changed from product to gift
              product={gift} // Changed from product to gift
              view={view}
            />
          ))}
        </div>
      </div>
    </>
  )
}
