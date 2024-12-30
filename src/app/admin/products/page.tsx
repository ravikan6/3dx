"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Save, Search, ArrowUpDown } from "lucide-react";
import ImageViewer from "@/component/admin/imageSlider/ImageViewer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/component/admin/sidebar/sidebar";

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  img: string[];
  categories: string[];
  inStock: number;
  soldStockValue: number;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/product/get-products"
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleViewImages = (images: string[]) => {
    setSelectedImages(images);
    setIsImageViewerOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      <div className="hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>
      <div className="flex-1 p-8 ml-2">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by product ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.categories.join(", ")}</TableCell>
                <TableCell>{product.productPrice}</TableCell>
                <TableCell>{product.inStock}</TableCell>
                <TableCell>{product.soldStockValue}</TableCell>
                <TableCell>{product.visibility}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewImages(product.img)}>
                    View Images
                  </Button>
                </TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ImageViewer
          images={selectedImages}
          onClose={() => setIsImageViewerOpen(false)}
          isOpen={isImageViewerOpen}
        />
      </div>
    </div>
  );
}
