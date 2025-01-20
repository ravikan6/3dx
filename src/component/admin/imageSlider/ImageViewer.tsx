import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GiftImageViewerProps {
  images: string[]  // Images representing different gift options
  onClose: () => void  // Function to close the viewer
  isOpen: boolean  // State to control if the viewer is open
}

const GiftImageViewer: React.FC<GiftImageViewerProps> = ({ images, onClose, isOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[75%] sm:h-[75vh]">
        <DialogHeader>
          <DialogTitle>Gift Images</DialogTitle> {/* Changed from Product to Gift */}
        </DialogHeader>
        <div className="relative w-full h-full">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={images[currentIndex]}
            alt={`Gift image ${currentIndex + 1}`}  {/* Updated to reflect Gift */}
            className="w-full h-full object-contain"
          />
          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 transform -translate-y-1/2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GiftImageViewer
