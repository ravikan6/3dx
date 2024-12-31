"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import type { Product } from "@/types/product";

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
    className={`bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl shadow-lg Rs.{className}`}
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
  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all mb-4">
    <img src={image} alt={name} className="w-16 h-16 object-cover rounded-xl" />
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-gray-600">Price: Rs.{price.toFixed(2)}</p>
      <p className="text-gray-600">Quantity: {quantity}</p>
    </div>
    <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all mt-4 sm:mt-0">
      <FaTrash />
    </button>
  </div>
);

const Cart: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = sessionStorage.getItem("userId");
  
      if (!userId) {
        setError("Please log in to view the cart.");
        setLoading(false);
        return;
      }
  
      try {
        // Fetch cart data
        const cartResponse = await fetch("https://backend3dx.onrender.com/cart/get-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
  
        const cartData = await cartResponse.json();
  
        if (!cartData.success) {
          setError("Failed to fetch cart data.");
          setLoading(false);
          return;
        }
  
        let productsInCart = JSON.parse(cartData.cart.productsInCart);
  
        // Filter out duplicates based on productId
        const uniqueProducts = productsInCart.filter(
          (item: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.productId === item.productId)
        );
  
        // Fetch product details for each unique product
        const productPromises = uniqueProducts.map(async (cartItem: any) => {
          const productResponse = await fetch(
            `https://backend3dx.onrender.com/product/product/${cartItem.productId}`
          );
          const productData = await productResponse.json();
  
          if (!productData.success) {
            throw new Error(`Failed to fetch product details for ID: ${cartItem.productId}`);
          }
  
          const product: Product = productData.product;
          return {
            name: product.productName,
            price: product.productPrice,
            quantity: cartItem.quantity,
            image: product.img[0], // Use the first image
          };
        });
  
        const products = await Promise.all(productPromises);
  
        setCartItems(products);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError("An error occurred while fetching cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartData();
  }, []);
  

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-all"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Your Cart
            </span>
            <span className="text-gray-600 block text-3xl mt-2">
              Review your selections and proceed to checkout
            </span>
          </h1>
        </div>

        {/* Cart Items and Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard title="Cart Items" dataAos="fade-right">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <CartItem
                  key={index}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                />
              ))
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}
          </SectionCard>

          <SectionCard title="Order Summary" dataAos="fade-left">
            <div className="text-gray-600 leading-relaxed">
              <p className="flex justify-between mb-4">
                <span>Subtotal:</span> <span>Rs.{totalAmount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between mb-4">
                <span>Shipping:</span> <span>Rs.5.99</span>
              </p>
              <p className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span> <span>Rs.{(totalAmount + 5.99).toFixed(2)}</span>
              </p>
            </div>
            <button
              className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-all"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Cart;
