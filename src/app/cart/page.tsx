"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import type { Product } from "@/types/product";

type CartItemProps = {
  id: string;
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

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  dataAos = "",
}) => (
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

const CartItem: React.FC<{
  item: CartItemProps;
  onDelete: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
}> = ({ item, onDelete, onUpdateQuantity }) => (
  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all mb-4">
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 object-cover rounded-xl"
    />
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
      <p className="text-gray-600">Price: Rs.{item.price.toFixed(2)}</p>
      <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
        <button
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all disabled:opacity-50"
          onClick={() =>
            item.quantity > 1 &&
            onUpdateQuantity(item.id, item.quantity - 1) // Decrement quantity
          }
          disabled={item.quantity <= 1}
        >
          <AiOutlineMinus />
        </button>
        <span className="text-gray-800">{item.quantity}</span>
        <button
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} // Increment quantity
        >
          <AiOutlinePlus />
        </button>
      </div>
    </div>
    <button
      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all mt-4 sm:mt-0"
      onClick={() => onDelete(item.id)} // Delete item
    >
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
        const cartResponse = await fetch(
          "https://backend3dx.onrender.com/cart/get-cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const cartData = await cartResponse.json();

        if (!cartData.success) {
          setError("Failed to fetch cart data.");
          setLoading(false);
          return;
        }

        const productsInCart = JSON.parse(cartData.cart.productsInCart);

        // Filter out duplicates based on productId
        const uniqueProducts = productsInCart.filter(
          (item: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.productId === item.productId)
        );

        // Fetch product details for each unique product
        const products = await Promise.all(uniqueProducts.map(async (cartItem: any) => {
          const productResponse = await fetch(
            `https://backend3dx.onrender.com/product/product/${cartItem.productId}`
          );
          const productData = await productResponse.json();

          if (!productData.success) {
            throw new Error(
              `Failed to fetch product details for ID: ${cartItem.productId}`
            );
          }

          const product: Product = productData.product;
          return {
            id: cartItem.productId,
            name: product.productName,
            price: product.productPrice,
            quantity: cartItem.productQty, // Changed from cartItem.quantity to cartItem.productQty
            image: product.img[0],
          };
        }));

        setCartItems(products);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(
          "An error occurred while fetching cart data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleDelete = async (productId: string) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/cart/delete-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );
      } else {
        console.error("Failed to delete item:", data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/cart/update-quantity",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            userId, 
            productId, 
            productQty: newQuantity 
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Update local state only after successful API response
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity:", data.message);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Optionally show an error message to the user
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onUpdateQuantity={handleUpdateQuantity}
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
              <p className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total:</span>{" "}
                <span>Rs.{(totalAmount + 0.00).toFixed(2)}</span>
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

