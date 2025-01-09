
// page.tsx
'use client'
interface Product {
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

interface Coupon {
  code: string;
  discount?: number;
}

interface Order {
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  orderedProducts: Product[];
  shippingAddress?: ShippingAddress;
  appliedCoupon?: Coupon;
  createdAt: string;
  userId: string;
  payment_id?: string;
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
    case 'paid':
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

export default function MyOrders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      const userId = sessionStorage.getItem('userId')
      const response = await fetch(`https://backend3dx.onrender.com/order/user-orders/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: { success: boolean; orders: Order[]; message?: string } = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId: string): Promise<void> => {
    setLoading(true);
    setSelectedOrder(null);

    try {
      const response = await fetch(`https://backend3dx.onrender.com/order/orders/${orderId}`);
      if (!response.ok) {
        throw new Error(`Error fetching order details: ${response.statusText}`);
      }
      const data: Order = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading orders...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.order_id}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.orderedProducts.map((item) => (
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
                      Total: ${order.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleViewDetails(order.order_id)}
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

        {loading && <div className="mt-8 text-center">Loading order details...</div>}

        {selectedOrder && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Details: #{selectedOrder.order_id}</h2>
            <p className="text-sm text-gray-500">Date: {formatDate(selectedOrder.createdAt)}</p>
            <p className="text-sm text-gray-500">Status: {selectedOrder.status}</p>
            
            {selectedOrder.shippingAddress && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-900">Shipping Address:</h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>
            )}
            
            <h3 className="mt-4 text-md font-semibold text-gray-900">Items:</h3>
            <ul className="mt-2 space-y-2">
              {selectedOrder.orderedProducts.map((item) => (
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
            
            {selectedOrder.appliedCoupon && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Coupon Applied: {selectedOrder.appliedCoupon.code}
                  {selectedOrder.appliedCoupon.discount && 
                    ` (-$${selectedOrder.appliedCoupon.discount.toFixed(2)})`
                  }
                </p>
              </div>
            )}
            
            <p className="mt-4 text-lg font-bold text-gray-900">
              Total: ${selectedOrder.amount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}