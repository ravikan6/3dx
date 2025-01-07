'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProductCard } from '@/component/user/ProductComponents/product-card'
import { CategoryFilter } from '@/component/user/ProductComponents/category-filter'
import { ViewToggle } from '@/component/user/ProductComponents/view-toggle'
import { SortProducts } from '@/component/user/ProductComponents/sort-products'
import type { Product } from '@/types/product'

type ProductsResponse = {
  products: Product[];
};

async function getProducts() {
  const response = await fetch('https://backend3dx.onrender.com/product/get-products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  console.log(data)
  return data as ProductsResponse;
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
            src="/hero/Shop.svg"
            alt="SHOP"
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
            alt="Explore our diverse collection of 3D printed collection"
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOrder, setSortOrder] = useState<string>('price-asc')

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data.products)
      } catch (err) {
        setError('Failed to load products')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Get unique categories from all products
  const allCategories = Array.from(
    new Set(products.flatMap(product => product.categories))
  )

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.categories.includes(selectedCategory))
    : products

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.productPrice - b.productPrice
    } else {
      return b.productPrice - a.productPrice
    }
  })

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <>
      <AnimatedHero />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Today's Best Deals For You!</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
            <CategoryFilter
              categories={allCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <div className="flex gap-4">
              <SortProducts onSortChange={setSortOrder} />
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </div>

        <div className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
            : 'flex flex-col gap-6'
        }>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              view={view}
            />
          ))}
        </div>
      </div>
    </>
  )
}

