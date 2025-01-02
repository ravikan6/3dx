import React from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
      <div className="text-gray-600 leading-relaxed">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-4">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <p className="flex justify-between mb-4">
          <span>Subtotal:</span> <span>Rs.{totalAmount.toFixed(2)}</span>
        </p>
        <p className="flex justify-between mb-4">
          <span>Shipping:</span> <span>Rs.5.99</span>
        </p>
        <p className="flex justify-between font-bold text-lg text-gray-800">
          <span>Total:</span>{" "}
          <span>Rs.{(totalAmount + 5.99).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

