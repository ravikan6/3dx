"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  productId: z.string().length(6),
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productPrice: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  inStock: z.number().min(0, {
    message: "In stock value must be a positive number.",
  }),
  categories: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one category.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProductPage() {
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: generateProductId(),
      productName: "",
      productPrice: 0,
      inStock: 0,
      categories: [],
    },
  });

  function generateProductId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          "https://backend3dx.onrender.com/image/image-upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setImages((prev) => [...prev, data.imageUrl]);
        } else {
          console.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      img: images,
      soldStockValue: 0,
      visibility: "on",
    };

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/product/create-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Product added successfully");
        form.reset({
          productId: generateProductId(),
          productName: "",
          productPrice: 0,
          inStock: 0,
          categories: [],
        });
        setImages([]);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h1>
      <div className="bg-white shadow rounded-lg p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100" />
                    </FormControl>
                    <FormDescription>
                      Auto-generated unique 6-digit code for the product.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormLabel>Product Images</FormLabel>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2 ${
                  isDragActive ? "bg-blue-50" : "bg-gray-100"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center text-gray-500">
                    Drop the files here...
                  </p>
                ) : (
                  <p className="text-center text-gray-500">
                    Drag and drop files here, or click to select files
                  </p>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg shadow"
                  />
                ))}
              </div>
            </div>
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormDescription>
                    Select applicable categories for the product.
                  </FormDescription>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {["electronics", "accessories", "fashion"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? [...field.value, item]
                                      : field.value?.filter(
                                          (value) => value !== item
                                        )
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Add Product
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
