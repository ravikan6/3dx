'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from './image-carousel'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  view: 'grid' | 'list'
}

export function ProductCard({ product, view }: ProductCardProps) {
  const cardClassName = view === 'grid' 
    ? 'w-[300px] h-[450px] flex flex-col'
    : 'w-full h-[200px] flex flex-row'

  const imageClassName = view === 'grid'
    ? 'w-full h-[250px] flex-shrink-0'
    : 'w-[200px] h-full flex-shrink-0'

  const contentClassName = view === 'grid'
    ? 'flex flex-col flex-grow p-4 gap-2'
    : 'flex flex-col flex-grow p-4 gap-2 justify-between'

  return (
    <div className={`group relative bg-card rounded-lg border shadow-sm ${cardClassName}`}>
      <div className={`${imageClassName} overflow-hidden`}>
        <ProductImage src={product.img[0]} alt={product.productName} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-5 w-5" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
      <div className={contentClassName}>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.productName}</h3>
          <p className="text-xl font-bold">₹{product.productPrice.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-4 w-4 fill-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-muted-foreground">(121)</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {product.inStock} in stock
          </p>
          <Button className="w-full">Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}
