'use client'

interface ImageProps {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: ImageProps) {
  return (
    <div className="relative w-full h-full bg-gray-100">
      <img
        src={src}
        alt={alt} // Alt attribute is essential for accessibility.
        className="w-full h-full object-cover object-center"
        style={{
          aspectRatio: "1 / 1", // Use aspect ratio to ensure square format
        }}
        loading="lazy" // Lazy loading for performance optimization
      />
    </div>
  )
}
