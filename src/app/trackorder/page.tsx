'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2, Gift, Filter, CheckCircle2 } from 'lucide-react';
import { CategoryFilter } from '@/components/user/GiftComponents/category-filter'; // Adjust for gifts
import { SortGifts } from '@/components/user/GiftComponents/sort-gifts'; // Adjust for gifts

interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const GiftPage = () => {
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('price-asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch('/api/gifts'); // Replace with your API endpoint
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch gifts');
        }

        setGifts(data.gifts);
        setCategories([...new Set(data.gifts.map((gift: Gift) => gift.category))]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  useEffect(() => {
    let filtered = [...gifts];

    if (selectedCategory) {
      filtered = filtered.filter(gift => gift.category === selectedCategory);
    }

    if (sortOrder === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredGifts(filtered);
  }, [gifts, selectedCategory, sortOrder]);

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
        <Card className="w-full max-w-lg">
          <CardContent className="text-center p-6">
            <CheckCircle2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/home')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Browse Gifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <SortGifts onSortChange={setSortOrder} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGifts.map(gift => (
                <div key={gift.id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                  <img src={gift.image} alt={gift.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{gift.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{gift.description}</p>
                  <p className="text-lg font-bold text-gray-900 mb-4">${gift.price}</p>
                  <Button onClick={() => router.push(`/gift/${gift.id}`)} className="w-full bg-blue-600 text-white">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => router.push('/home')} className="bg-gray-800 text-white">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPage;
