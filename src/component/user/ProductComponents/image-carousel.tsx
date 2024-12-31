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
        alt={alt}
        className="w-full h-full object-cover object-center"
        style={{
          aspectRatio: "1/1",
          objectFit: "cover",
        }}
        loading="lazy"
      />
    </div>
  )
}

