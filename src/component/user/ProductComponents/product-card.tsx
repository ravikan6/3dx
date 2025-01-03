"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "./image-carousel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ProductCardProps {
  product: Product;
  view: "grid" | "list";
}

export function ProductCard({ product, view }: ProductCardProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleAddToCart = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      setShowDialog(true);
      return;
    }

    try {
      await axios.post("https://backend3dx.onrender.com/cart/addtocart", {
        userId,
        productId: product.productId,
        quantity: 1,
      });

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const cardClassName =
    view === "grid"
      ? "w-full h-[420px] flex flex-col" // Fixed height and flexible width in grid view
      : "w-full min-h-[200px] flex flex-row"; // Flexible for list view

  const imageContainerClassName =
    view === "grid"
      ? "h-[280px] w-full flex-shrink-0" // Fixed image size for grid view
      : "w-[200px] h-[200px] flex-shrink-0"; // Square image in list view

  return (
    <>
      <div
        className={`group relative bg-card rounded-lg border shadow-sm overflow-hidden ${cardClassName}`}
      >
        <Link
          href={`/shop/${product.productId}`}
          className={`block ${imageContainerClassName}`}
        >
          <div className="relative w-full h-full">
            <ProductImage src={product.img[0]} alt={product.productName} />
          </div>
        </Link>

        <div
          className={`flex flex-col p-4 ${
            view === "grid" ? "flex-grow" : "flex-1 ml-4"
          }`}
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">
              {product.productName}
            </h3>
            <p className="text-lg font-bold">
              ₹{product.productPrice.toLocaleString("en-IN")}
            </p>
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
          <div className="space-y-2 mt-auto">
            <p className="text-sm text-muted-foreground">
              {product.inStock} in stock
            </p>
            <Button
              className="w-full"
              onClick={handleAddToCart}
              size={view === "grid" ? "default" : "sm"}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oops! You are not logged in</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Please log in to add products to your cart.
          </p>
          <DialogFooter>
            <Button onClick={() => router.push("/login")}>I'll Login</Button>
            <Button variant="ghost" onClick={() => router.push("/shop")}>
              No, I'll Pass
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Parent container for product cards
const ProductList = ({
  products,
  view,
}: {
  products: Product[];
  view: "grid" | "list";
}) => {
  console.log(ProductList);
  return (
    <div
      className={`grid gap-4 ${
        view === "grid"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : ""
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} view={view} />
      ))}
    </div>
  );
};
