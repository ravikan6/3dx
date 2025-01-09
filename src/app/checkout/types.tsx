export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    img: string[];
    productName: string;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    name?: string;
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
      track_status: TrackingStatus[];
    };
    etd: string;
    courier_name: string;
  }
  
  export interface ShipRocketOrder {
    order_id: string;
    shipment_id: string;
    status: string;
    created_at: string;
  }