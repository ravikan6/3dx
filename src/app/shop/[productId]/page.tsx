'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'

export default function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://backend3dx.onrender.com/product/product/${productId}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.product)
          // Update page title
          document.title = data.product.productName
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Left column - Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={product.img[selectedImage]}
            alt={product.productName}
                        className="object-cover"
            loading='lazy'
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {product.img.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 aspect-square flex-shrink-0 rounded-md overflow-hidden border-2 
                ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
            >
              <img
                src={image}
                alt={`${product.productName} view ${index + 1}`}
                
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right column - Product details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-gray-600">{product.categories.join(', ')}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 4 ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">441 reviews</span>
        </div>

        <div className="text-3xl font-bold">
          ${product.productPrice.toFixed(2)}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Stock: {product.inStock} units available
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1" variant="outline">
            Buy Now
          </Button>
          <Button className="flex-1">
            Add to basket
          </Button>
          <Button size="icon" variant="outline">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

