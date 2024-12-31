import React from "react";

type CartItemProps = {
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  dataAos?: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = "", dataAos = "" }) => (
  <div
    data-aos={dataAos}
    className={`bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl shadow-lg ${className}`}
    style={{
      background: "linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)",
    }}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const CartItem: React.FC<CartItemProps> = ({ name, price, quantity, image }) => (
  <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all mb-4">
    <img src={image} alt={name} className="w-16 h-16 object-cover rounded-xl" />
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
      <p className="text-gray-600">Quantity: {quantity}</p>
    </div>
    <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
      Remove
    </button>
  </div>
);

const cart: React.FC = () => {
  const cartItems = [
    {
      name: "3D Printed Lamp",
      price: 49.99,
      quantity: 1,
      image: "https://via.placeholder.com/64",
    },
    {
      name: "3D Wall Art",
      price: 89.99,
      quantity: 2,
      image: "https://via.placeholder.com/64",
    },
  ];

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Your Cart
            </span>
            <span className="text-gray-600 block text-3xl mt-2">Review your selections and proceed to checkout</span>
          </h1>
        </div>

        {/* Cart Items and Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard title="Cart Items" dataAos="fade-right">
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
              />
            ))}
          </SectionCard>

          <SectionCard title="Order Summary" dataAos="fade-left">
            <div className="text-gray-600 leading-relaxed">
              <p className="flex justify-between mb-4">
                <span>Subtotal:</span> <span>${totalAmount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between mb-4">
                <span>Shipping:</span> <span>$5.99</span>
              </p>
              <p className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span> <span>${(totalAmount + 5.99).toFixed(2)}</span>
              </p>
            </div>
            <button className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-all">
              Proceed to Checkout
            </button>
          </SectionCard>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-16 bg-gray-100 rounded-2xl p-8 shadow-lg">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Ready to Checkout?
            </span>
            <span className="text-gray-600 block text-2xl mt-2">Complete your purchase and enjoy our products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Thank you for shopping with 3D XYZ. We are excited to bring the best of 3D products to your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
};

export default cart;