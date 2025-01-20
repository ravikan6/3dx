'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GiftCard } from "@/components/user/GiftComponents/gift-card"; // Adjusted for gifts
import { CategoryFilter } from "@/components/user/GiftComponents/category-filter"; // Adjusted for gifts
import { ViewToggle } from "@/components/user/GiftComponents/view-toggle"; // Adjusted for gifts
import { SortGifts } from "@/components/user/GiftComponents/sort-gifts"; // Adjusted for gifts
import { useRouter } from "next/navigation";

export default function GiftPage() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState('price-asc');
  const router = useRouter();

  useEffect(() => {
    async function loadGifts() {
      try {
        const response = await fetch("https://your-api-url.com/gifts");
        const data = await response.json();
        setGifts(data.gifts);
      } catch (err) {
        setError("Failed to load gifts");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadGifts();
  }, []);

  // Get unique categories from all gifts
  const allCategories = Array.from(
    new Set(gifts.flatMap(gift => gift.categories))
  );

  // Filter gifts by selected category
  const filteredGifts = selectedCategory
    ? gifts.filter(gift => gift.categories.includes(selectedCategory))
    : gifts;

  // Sort gifts
  const sortedGifts = [...filteredGifts].sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Gifts For You!
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-8">
          <CategoryFilter
            categories={allCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="flex gap-4">
            <SortGifts onSortChange={setSortOrder} />
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center' : 'flex flex-col gap-6'}>
          {sortedGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              view={view}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            onClick={() => router.push("/cart")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Go to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
