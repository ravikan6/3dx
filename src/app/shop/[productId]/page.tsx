"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/types/product";

export default function GiftPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [gift, setGift] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const response = await fetch(`https://backend3dx.onrender.com/product/product/${productId}`);
        const data = await response.json();

        if (data.success) {
          setGift(data.product);
          // Update page title to reflect gift item
          document.title = `Gift: ${data.product.productName}`;
        } else {
          setError("Gift item not found");
        }
      } catch (err) {
        setError("Failed to load gift item");
        console.error("Error fetching gift item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [productId]);

  const handleAddToGiftBox = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      // Show dialog if userId is not available in session storage
      setShowDialog(true);
      return;
    }

    try {
      // Make the API call to add the gift to the user's gift box (or cart)
      await fetch("https://backend3dx.onrender.com/cart/addtocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: gift?.productId,
          quantity: 1,
        }),
      });

      alert("Gift added to your gift box!");
    } catch (error) {
      console.error("Error adding gift to box:", error);
      alert("Failed to add gift to your box. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Gift item not found"}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 mt-12">
        {/* Left column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={gift.img[selectedImage]}
              alt={gift.productName}
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {gift.img.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 aspect-square flex-shrink-0 rounded-md overflow-hidden border-2 
                  ${selectedImage === index ? "border-primary" : "border-transparent"}`}
              >
                <img
                  src={image}
                  alt={`${gift.productName} view ${index + 1}`}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column - Gift details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{gift.productName}</h1>
            <p className="text-gray-600">{gift.categories.join(", ")}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">441 reviews</span>
          </div>

          <div className="text-3xl font-bold">
            ₹{gift.productPrice.toFixed(2)}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Stock: {gift.inStock} units available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" variant="outline">
              Buy Now
            </Button>
            <Button className="flex-1" onClick={handleAddToGiftBox}>
              Add to Gift Box
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog Box for non-logged-in users */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Oops! You are not logged in</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Please log in to add gifts to your gift box.
            </p>
            <DialogFooter>
              <Button
                onClick={() => {
                  router.push("/login");
                }}
              >
                I'll Login
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/shop");
                }}
              >
                No, I'll Pass
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
