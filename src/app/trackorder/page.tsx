"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package2, Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
}

interface TrackingData {
  current_status: string;
  awb_code: string;
  courier_name: string;
  destination: string;
  pickup_date: string;
  etd: string;
  tracking_data: TrackingEvent[];
}

const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'PENDING': 'text-yellow-500',
    'PICKED UP': 'text-blue-500',
    'IN_TRANSIT': 'text-blue-600',
    'OUT_FOR_DELIVERY': 'text-purple-500',
    'DELIVERED': 'text-green-500',
    'CANCELLED': 'text-red-500',
    'DELAYED': 'text-orange-500'
  };
  return statusColors[status] || 'text-gray-500';
};

const TrackOrder = () => {
  const router = useRouter();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const shipmentId = sessionStorage.getItem('currentOrderShipmentId');
        if (!shipmentId) {
          setError('No shipment ID found');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/orders/track/${shipmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tracking information');
        }

        const data: TrackingData = await response.json();
        setTrackingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

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
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/orders')}>
              View All Orders
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
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">Order Tracking</span>
              <span className={`text-lg font-medium ${getStatusColor(trackingData?.current_status || '')}`}>
                {trackingData?.current_status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipment Details</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600">
                    <Package2 className="w-5 h-5 mr-2" />
                    AWB: {trackingData?.awb_code}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <Truck className="w-5 h-5 mr-2" />
                    Courier: {trackingData?.courier_name}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    Destination: {trackingData?.destination}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">ETD</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Pickup Date: {trackingData?.pickup_date ? new Date(trackingData.pickup_date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    Expected Delivery: {trackingData?.etd ? new Date(trackingData.etd).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
              <div className="space-y-4">
                {trackingData?.tracking_data?.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className={`w-6 h-6 ${getStatusColor(event.status)}`} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => router.push('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
