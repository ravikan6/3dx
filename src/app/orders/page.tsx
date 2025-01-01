'use client'

import { useState } from 'react';
import { Eye } from 'lucide-react';
import Image from 'next/image';

const mockOrders = [
  {
    id: "ORD001",
    date: "2024-01-31",
    items: [
      {
        id: 1,
        name: "Custom 3D Portrait",
        image: "/placeholder.svg?height=100&width=100",
        price: "$99.99",
        status: "Delivered"
      }
    ],
    total: "$99.99",
    status: "Delivered"
  },
  {
    id: "ORD002",
    date: "2024-01-28",
    items: [
      {
        id: 2,
        name: "3D Printed Vase Set",
        image: "/placeholder.svg?height=100&width=100",
        price: "$45.99",
        status: "Processing"
      }
    ],
    total: "$45.99",
    status: "Processing"
  },
  {
    id: "ORD003",
    date: "2024-01-25",
    items: [
      {
        id: 3,
        name: "Architectural Model Kit",
        image: "/placeholder.svg?height=100&width=100",
        price: "$149.99",
        status: "Shipped"
      }
    ],
    total: "$149.99",
    status: "Shipped"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = async (orderId: string) => {
    setLoading(true);
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Error fetching order details: ${response.statusText}`);
      }
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your orders</p>
        </div>

        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-t border-gray-200">
                    <div className="h-20 w-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{item.price}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium text-gray-900">
                    Total: {order.total}
                  </div>
                  <button
                    onClick={() => handleViewDetails(order.id)}
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

        {loading && <div className="mt-8 text-center">Loading order details...</div>}

        {selectedOrder && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Details: #{selectedOrder.id}</h2>
            <p className="text-sm text-gray-500">Date: {selectedOrder.date}</p>
            <p className="text-sm text-gray-500">Status: {selectedOrder.status}</p>
            <h3 className="mt-4 text-md font-semibold text-gray-900">Items:</h3>
            <ul className="mt-2 space-y-2">
              {selectedOrder.items.map((item: any) => (
                <li key={item.id} className="flex items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-lg font-bold text-gray-900">Total: {selectedOrder.total}</p>
          </div>
        )}
      </div>
    </main>
  );
}
