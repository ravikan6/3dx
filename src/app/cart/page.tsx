"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaGift } from "react-icons/fa"; // Icon change for gift
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import type { Product } from "@/types/product";

type GiftItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  dataAos?: string;
};

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  dataAos = "",
}) => (
  <div
    data-aos={dataAos}
    className={`bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl shadow-lg Rs.{className}`}
    style={{
      background: "linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)",
    }}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const GiftItem: React.FC<{
  item: GiftItemProps;
  onGift: (productId: string) => void; // On gift action
}> = ({ item, onGift }) => (
  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all mb-4">
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 object-cover rounded-xl"
    />
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      <p className="text-gray-600">Price: Rs.{item.price.toFixed(2)}</p>
    </div>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all mt-4 sm:mt-0"
      onClick={() => onGift(item.id)} // Gift this item
    >
      <FaGift />
    </button>
  </div>
);

const Gift: React.FC = () => {
  const router = useRouter();
  const [giftItems, setGiftItems] = useState<GiftItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGiftData = async () => {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        setError("Please log in to view the gift items.");
        setLoading(false);
        return;
      }

      try {
        // Fetch gift data
        const giftResponse = await fetch(
          "https://backend3dx.onrender.com/gift/get-gift-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const giftData = await giftResponse.json();

        if (!giftData.success) {
          setError("Failed to fetch gift data.");
          setLoading(false);
          return;
        }

        const productsInGift = JSON.parse(giftData.gift.productsInGift);

        // Fetch product details for each gift item
        const products = await Promise.all(
          productsInGift.map(async (giftItem: any) => {
            try {
              const productResponse = await fetch(
                `https://backend3dx.onrender.com/product/product/${giftItem.productId}`
              );
              const productData = await productResponse.json();

              if (!productData.success) {
                console.warn(`Product not found for ID: ${giftItem.productId}`);
                return null;
              }

              const product: Product = productData.product;
              return {
                id: giftItem.productId,
                name: product.productName,
                price: product.productPrice,
                quantity: giftItem.productQty,
                image: product.img[0],
              };
            } catch (error) {
              console.error(
                `Error fetching product ${giftItem.productId}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out null values (products that weren't found)
        setGiftItems(
          products.filter(
            (product): product is GiftItemProps => product !== null
          )
        );
      } catch (error) {
        console.error("Error fetching gift data:", error);
        setError(
          "An error occurred while fetching gift data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGiftData();
  }, []);

  const handleGift = async (productId: string) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/gift/add-to-gift-list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Optionally, you can update the local state or give a success message.
      } else {
        console.error("Failed to add item to gift list:", data.message);
      }
    } catch (error) {
      console.error("Error adding item to gift list:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-all"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Your Gift List
            </span>
            <span className="text-gray-600 block text-3xl mt-2">
              Choose the items you want to gift
            </span>
          </h1>
        </div>

        {/* Gift Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard title="Gift Items" dataAos="fade-right">
            {giftItems.length > 0 ? (
              giftItems.map((item) => (
                <GiftItem
                  key={item.id}
                  item={item}
                  onGift={handleGift}
                />
              ))
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Oops! You didn't add anything to your gift list.
                </p>
                <button
                  onClick={() => router.push("/shop")}
                  className="px-6 py-3 bg-black text-white rounded-xl text-lg font-bold hover:bg-gray-800 transition-all"
                >
                  Let's Go Shop Now
                </button>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Gift;
