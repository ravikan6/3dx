"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Pencil,
  Save,
  Search,
  ArrowUpDown,
  Trash,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  img: string[];
  categories: string[];
  inStock: number;
  soldStockValue: number;
  visibility: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditValues {
  productName: string;
  categories: string[];
  productPrice: number;
  inStock: number;
  soldStockValue: number;
  visibility: string;
  description?: string;
  img: string[];
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  const [editValues, setEditValues] = useState<EditValues>({
    productName: "",
    categories: [],
    productPrice: 0,
    inStock: 0,
    soldStockValue: 0,
    visibility: "",
    description: "",
    img: [],
  });

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

  const handleSort = (key: keyof Product) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus("");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setIsUploading(true);
      setUploadStatus("Uploading...");

      const response = await fetch(
        "https://backend3dx.onrender.com/image/image-upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        setEditValues((prev) => ({
          ...prev,
          img: [...prev.img, data.imageUrl],
        }));
        setUploadStatus("Upload successful");
        setSelectedFile(null);
        const fileInput = document.getElementById("imageInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setUploadStatus("Upload failed: " + data.message);
      }
    } catch (error) {
      setUploadStatus("Upload failed: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await fetch("https://backend3dx.onrender.com/product/product-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    const updatedImages = editValues.img.filter((img) => img !== imageUrl);
    setEditValues((prev) => ({
      ...prev,
      img: updatedImages,
    }));

    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setEditValues({
      productName: product.productName,
      categories: product.categories,
      productPrice: product.productPrice,
      inStock: product.inStock,
      soldStockValue: product.soldStockValue,
      visibility: product.visibility,
      description: product.description || "",
      img: product.img,
    });
    setShowDetailModal(true);
    setCurrentImageIndex(0);
  };

  const handleSave = async (productId: string) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/product/update-product",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            ...editValues,
          }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        setShowDetailModal(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 0 ? editValues.img.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === editValues.img.length - 1 ? 0 : prev + 1
      );
    }
  };

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    let sortableProducts = [...products];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        // if (a[sortConfig.key!] < b[sortConfig.key!]) {
        //   return sortConfig.direction === "ascending" ? -1 : 1;
        // }
        // if (a[sortConfig.key!] > b[sortConfig.key!]) {
        //   return sortConfig.direction === "ascending" ? 1 : -1;
        // }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.productId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>
      <div className="flex-1 p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="relative">
            <div
              className={`flex items-center ${
                isSearchExpanded ? "w-full md:w-64" : "w-10 md:w-64"
              } transition-all duration-300`}
            >
              <Search className="absolute left-2 z-10 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("productId")}
              >
                <div className="flex items-center">
                  Product ID
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("productName")}
              >
                <div className="flex items-center">
                  Product Name
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("productPrice")}
              >
                <div className="flex items-center">
                  Price
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {product.productName}
                  </button>
                </TableCell>
                <TableCell>{product.categories.join(", ")}</TableCell>
                <TableCell>{product.productPrice}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.productId)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-screen overflow-scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Product" : "Product Details"}
              </h2>
            </div>

            {/* Image Carousel */}
            <div className="relative mb-6 h-64">
              {editValues.img && editValues.img.length > 0 ? (
                <>
                  <img
                    src={editValues.img[currentImageIndex]}
                    alt={`Product ${currentImageIndex + 1}`}
                    className="w-full h-64 object-contain"
                  />
                  {editingId && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        handleDeleteImage(editValues.img[currentImageIndex])
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  {editValues.img.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={() => handleImageNavigation("prev")}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => handleImageNavigation("next")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={editValues.productName}
                    onChange={(e) =>
                      setEditValues({ ...editValues, productName: e.target.value })
                    }
                    disabled={!editingId}
                  />
                </div>
                <div>
                  <Label>Categories</Label>
                  <Input
                    value={editValues.categories.join(", ")}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        categories: e.target.value.split(",").map((c) => c.trim()),
                      })
                    }
                    disabled={!editingId}
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={editValues.productPrice}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        productPrice: Number(e.target.value),
                      })
                    }
                    disabled={!editingId}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>In Stock</Label>
                  <Input
                    type="number"
                    value={editValues.inStock}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        inStock: Number(e.target.value),
                      })
                    }
                    disabled={!editingId}/>
                    </div>
                    <div>
                      <Label>Sold</Label>
                      <Input
                        type="number"
                        value={editValues.soldStockValue}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            soldStockValue: Number(e.target.value),
                          })
                        }
                        disabled={!editingId}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        disabled={!editingId}
                        className="h-32"
                      />
                    </div>
                  </div>
                </div>
    
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  {editingId ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          if (selectedProduct) {
                            setEditValues({
                              productName: selectedProduct.productName,
                              categories: selectedProduct.categories,
                              productPrice: selectedProduct.productPrice,
                              inStock: selectedProduct.inStock,
                              soldStockValue: selectedProduct.soldStockValue,
                              visibility: selectedProduct.visibility,
                              description: selectedProduct.description || "",
                              img: selectedProduct.img,
                            });
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleSave(selectedProduct?.productId!)}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditingId(selectedProduct?.productId!)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Product
                    </Button>
                  )}
                </div>
    
                {/* Image Upload Section */}
                {editingId && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Upload New Images</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer group">
                          <div className="flex items-center justify-center h-36 px-4 transition-all border-2 border-dashed rounded-xl border-gray-300 hover:border-black-400 hover:bg-black-50/50">
                            <div className="flex flex-col items-center space-y-2 text-center">
                              <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-black-500" />
                              <span className="text-sm text-gray-500 group-hover:text-black-600">
                                {selectedFile
                                  ? selectedFile.name
                                  : "Drop image here or click to browse"}
                              </span>
                            </div>
                            <input
                              type="file"
                              id="imageInput"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </div>
                        </label>
                        <Button
                          onClick={handleImageUpload}
                          disabled={!selectedFile || isUploading}
                          className="gap-2"
                        >
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>{isUploading ? "Uploading..." : "Upload"}</span>
                        </Button>
                      </div>
    
                      {uploadStatus && (
                        <p
                          className={`text-sm font-medium ${
                            uploadStatus.includes("failed") ||
                            uploadStatus.includes("Error")
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {uploadStatus}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      );
    }