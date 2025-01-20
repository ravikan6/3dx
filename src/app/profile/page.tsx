'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchUserGifts } from '@/utils/api';

type GiftItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type Gift = {
  gift_id: string;
  sender: string;
  recipient: string;
  message: string;
  amount: number;
  status: string;
  createdAt: string;
  giftItems: GiftItem[];
};

export default function MyGifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setError('User ID not found. Please log in.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userGifts = await fetchUserGifts(userId);
        setGifts(userGifts);
      } catch (err) {
        setError('Failed to fetch gifts data. Please try again.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'created':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-lg overflow-hidden"
        >
          <div className="pt-8 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Gifts</h1>
                <p className="text-sm text-gray-500">Manage your sent gifts and track their status</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Display Gift Details */}
              {gifts.length === 0 ? (
                <div className="text-center text-gray-600">
                  No gifts have been sent yet.
                </div>
              ) : (
                gifts.map((gift) => (
                  <div key={gift.gift_id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Gift to {gift.recipient}</h2>
                    <p className="text-sm text-gray-700"><strong>Message:</strong> {gift.message}</p>
                    <p className="text-sm text-gray-700"><strong>Sent by:</strong> {gift.sender}</p>
                    <p className="text-sm text-gray-700"><strong>Status:</strong> 
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gift.status)}`}>
                        {gift.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700"><strong>Amount:</strong> ₹{gift.amount}</p>
                    <p className="text-sm text-gray-700"><strong>Sent on:</strong> {new Date(gift.createdAt).toLocaleDateString()}</p>

                    {/* Display Gift Items */}
                    <div className="mt-4 space-y-2">
                      {gift.giftItems.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-20 w-20 flex-shrink-0">
                            <img
                              src={item.image || '/placeholder.png'}
                              alt={item.name}
                              className="rounded-lg object-cover"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>

            <div className="mt-8 text-center">
              <Link href="/gift-history" className="text-indigo-600 hover:text-indigo-800 underline">
                View Gift History
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
