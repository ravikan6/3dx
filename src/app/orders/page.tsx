'use client'

interface GiftItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Gift {
  gift_id: string;
  sender: string;
  recipient: string;
  message: string;
  shippingAddress?: ShippingAddress;
  giftItems: GiftItem[];
  amount: number;
  status: string;
  createdAt: string;
}

import { useState, useEffect, JSX } from 'react';
import { Eye } from 'lucide-react';
import Image from 'next/image';

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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function MyGifts(): JSX.Element {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async (): Promise<void> => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch(`https://backend3dx.onrender.com/gift/user-gifts/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }
      const data: { success: boolean; gifts: Gift[]; message?: string } = await response.json();
      if (data.success) {
        setGifts(data.gifts);
      } else {
        setError(data.message || 'Failed to fetch gifts');
      }
    } catch (err) {
      setError('Failed to load gifts. Please try again later.');
      console.error('Error fetching gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (giftId: string): Promise<void> => {
    setLoading(true);
    setSelectedGift(null);

    try {
      const response = await fetch(`https://backend3dx.onrender.com/gift/gifts/${giftId}`);
      if (!response.ok) {
        throw new Error(`Error fetching gift details: ${response.statusText}`);
      }
      const data: Gift = await response.json();
      setSelectedGift(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load gift details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && gifts.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading gifts...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Gifts</h1>
          <p className="mt-2 text-gray-600">View and track your sent gifts</p>
        </div>

        {gifts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't sent any gifts yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {gifts.map((gift) => (
              <div key={gift.gift_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Gift to {gift.recipient}</h3>
                      <p className="text-sm text-gray-500">
                        Sent on {formatDate(gift.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gift.status)}`}>
                      {gift.status}
                    </span>
                  </div>

                  {gift.giftItems.map((item) => (
                    <div key={item.id} className="flex items-center py-4 border-t border-gray-200">
                      <div className="h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-6 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm font-medium text-gray-900">
                      Total: ₹{gift.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleViewDetails(gift.gift_id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && <div className="mt-8 text-center">Loading gift details...</div>}

        {selectedGift && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">Gift Details: {selectedGift.gift_id}</h2>
            <p className="text-sm text-gray-500">Sent by: {selectedGift.sender}</p>
            <p className="text-sm text-gray-500">Message: {selectedGift.message}</p>

            {selectedGift.shippingAddress && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-900">Shipping Address:</h3>
                <p className="text-sm text-gray-600">
                  {selectedGift.shippingAddress.street}<br />
                  {selectedGift.shippingAddress.city}, {selectedGift.shippingAddress.state} {selectedGift.shippingAddress.zipCode}
                </p>
              </div>
            )}
            
            <h3 className="mt-4 text-md font-semibold text-gray-900">Items:</h3>
            <ul className="mt-2 space-y-2">
              {selectedGift.giftItems.map((item) => (
                <li key={item.id} className="flex items-center">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-lg font-bold text-gray-900">
              Total: ₹{selectedGift.amount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
