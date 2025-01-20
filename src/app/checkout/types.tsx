// Refactored Interfaces for Gift Page

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
    name?: string;  // Optional name field for the recipient
}

export interface OrderCalculation {
    subtotal: number;
    shippingCharges: number;  // This can be removed if not needed for the gift order
    total: number;
}

export interface OrderedProduct {
    productId: string;
    quantity: number;
    price: number;
    name: string;
}

// For Gift Orders: Adding gift-related properties
export interface GiftOrder {
    recipientName: string;
    giftMessage: string;
    orderedProducts: OrderedProduct[];
    totalAmount: number;
}

// Track gift delivery status
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

// This would track gift order shipments with status updates
export interface ShipRocketOrder {
    order_id: string;
    shipment_id: string;
    status: string;
    created_at: string;
}

// Adding the RazorpayOrder and PaymentResponse interfaces if gift transactions still need to be processed (can be omitted for gift-only logic)
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

