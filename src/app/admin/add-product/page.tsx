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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is a unique 6-digit code generated for your product.
                </FormDescription>
                <FormMessage />
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
                <FormMessage />
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Product Images</FormLabel>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2 ${
                isDragActive ? "bg-blue-50" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Categories</FormLabel>
                  <FormDescription>
                    Select the categories that apply to this product.
                  </FormDescription>
                </div>
                {["electronics", "accessories", "fashion"].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Product</Button>
        </form>
      </Form>
    </div>
  );
}
