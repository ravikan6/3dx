'use client'

interface ImageProps {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: ImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
