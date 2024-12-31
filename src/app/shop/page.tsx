'use client'

import { useState, useEffect } from 'react'
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
  return data as ProductsResponse;
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
  )
}

