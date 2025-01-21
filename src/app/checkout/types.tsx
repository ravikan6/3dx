export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  img: string[];  // This can be kept as an array if you are storing URLs for multiple images
  productName: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  name?: string;  // name is optional, as per your initial definition
}

export interface OrderCalculation {
  subtotal: number;
  shippingCharges: number;
  total: number;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface OrderedProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface TrackingStatus {
  status: string;
  location: string;
  timestamp: string;
  activity: string;
}

export interface TrackingDetails {
  shipment_id: string;
  current_status: string;
  tracking_data: {
    track_status: TrackingStatus[];  // This assumes an array of statuses
  };
  etd: string;  // Estimated time of delivery
  courier_name: string;
}

export interface ShipRocketOrder {
  order_id: string;
  shipment_id: string;
  status: string;
  created_at: string;
}
