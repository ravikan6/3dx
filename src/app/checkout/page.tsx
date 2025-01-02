"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/AddressForm";
import OrderSummary from "@/components/OrderSummary";
import SavedAddressesDialog from "@/components/SavedAddressesDialog";

type Address = {
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const Checkout: React.FC = () => {
  const router = useRouter();
  const [address, setAddress] = useState<Address>({
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState({
    address: true,
    cart: true,
    payment: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to proceed with checkout.");
      setLoading({ address: false, cart: false, payment: false });
      return;
    }

    const fetchAddresses = async () => {
      try {
        const addressResponse = await fetch(
          "https://backend3dx.onrender.com/address/fetch-address",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        );
        const addressData = await addressResponse.json();
        if (addressData.success && addressData.addresses.length > 0) {
          setSavedAddresses(addressData.addresses);
          setShowAddressDialog(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading((prev) => ({ ...prev, address: false }));
      }
    };

    const fetchCartData = async () => {
      try {
        const cartResponse = await fetch(
          "https://backend3dx.onrender.com/cart/get-cart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        );
        const cartData = await cartResponse.json();
        if (cartData.success) {
          const productsInCart = JSON.parse(cartData.cart.productsInCart);
          const cartItemsPromises = productsInCart.map(async (item: any) => {
            const productResponse = await fetch(
              `https://backend3dx.onrender.com/product/product/${item.productId}`
            );
            const productData = await productResponse.json();
            if (productData.success) {
              return {
                id: item.productId,
                name: productData.product.productName,
                price: productData.product.productPrice,
                quantity: item.productQty,
                image: productData.product.img[0],
              };
            }
            throw new Error(
              `Failed to fetch product details for ID: ${item.productId}`
            );
          });
          const resolvedCartItems = await Promise.all(cartItemsPromises);
          setCartItems(resolvedCartItems);
        } else {
          throw new Error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(
          "An error occurred while fetching cart data. Please try again."
        );
      } finally {
        setLoading((prev) => ({ ...prev, cart: false }));
      }
    };

    fetchAddresses();
    fetchCartData();
  }, []);

  const handleSaveAddress = async () => {
    if (!saveAddress) return; // Only proceed if saveAddress is true

    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/address/save-address",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...address }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Address saved successfully!");
      } else {
        alert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving the address. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (saveAddress) {
      await handleSaveAddress();
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to proceed with checkout.");
      return;
    }

    setLoading((prev) => ({ ...prev, payment: true }));

    try {
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const orderPayload = {
        order_id: `order_${Date.now()}`, // Generate a unique order ID
        amount: totalAmount,
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        status: "created", // Default status
        userId: userId,
        orderedProducts: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address, // Include the address in the order payload
      };

      const saveOrderResponse = await fetch(
        "https://backend3dx.onrender.com/order/save-orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );

      const orderData = await saveOrderResponse.json();

      if (orderData.success) {
        setPaymentResponse("Order saved successfully! Your order has been placed.");
      } else {
        setPaymentResponse("Failed to save order. Please try again.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      setPaymentResponse(
        "An error occurred while saving your order. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, payment: false }));
    }
  };

  if (loading.address || loading.cart) {
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
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (loading.payment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Processing your order...</p>
        </div>
      </div>
    );
  }

  if (paymentResponse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">{paymentResponse}</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
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
              Checkout
            </span>
            <span className="text-gray-600 block text-3xl mt-2">
              Enter your address and review your order
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AddressForm
            address={address}
            setAddress={setAddress}
            saveAddress={saveAddress}
            setSaveAddress={setSaveAddress}
          />
          <OrderSummary cartItems={cartItems} />
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-8">
          <Button size="lg" onClick={handleCheckout}>
            Confirm and Pay
          </Button>
        </div>
      </div>

      <SavedAddressesDialog
        showAddressDialog={showAddressDialog}
        setShowAddressDialog={setShowAddressDialog}
        savedAddresses={savedAddresses}
        setAddress={setAddress}
      />
    </div>
  );
};

export default Checkout;
