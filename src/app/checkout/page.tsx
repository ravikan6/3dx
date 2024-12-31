"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Address = {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
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
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState({ address: true, cart: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to proceed with checkout.");
      setLoading({ address: false, cart: false });
      return;
    }

    const fetchAddresses = async () => {
      try {
        const addressResponse = await fetch(
          "https://backend3dx.onrender.com/fetch-address",
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
        // We don't set a global error here, as we want the checkout to continue
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    if (!saveAddress) return;

    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/address-save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, address }),
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
    await handleSaveAddress();

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to proceed with checkout.");
      return;
    }

    try {
      // Make API calls for each item in the cart
      const orderPromises = cartItems.map((item) =>
        fetch("https://backend3dx.onrender.com/order/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }),
        }).then((res) => res.json())
      );

      const results = await Promise.all(orderPromises);

      // Check if all orders were successful
      const allOrdersSuccessful = results.every((result) => result.success);

      if (allOrdersSuccessful) {
        alert("Order was successful!");
        router.push("/");
      } else {
        alert("There was an issue processing your order. Please try again.");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      alert("An error occurred while processing your order. Please try again.");
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
          {/* Address Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Shipping Address
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={address.phone}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="saveAddress"
                checked={saveAddress}
                onCheckedChange={(checked) =>
                  setSaveAddress(checked as boolean)
                }
              />
              <label
                htmlFor="saveAddress"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save address for future use
              </label>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
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
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-8">
          <Button size="lg" onClick={handleCheckout}>
            Confirm and Pay
          </Button>
        </div>
      </div>

      {/* Saved Addresses Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent>
          <DialogTitle>Saved Addresses</DialogTitle>
          <DialogDescription>
            Select an address or enter a new one.
          </DialogDescription>
          {savedAddresses.map((savedAddress, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="font-bold">Address {index + 1}</h3>
              <p>
                {savedAddress.street}, {savedAddress.city}
              </p>
              <p>
                {savedAddress.state}, {savedAddress.pincode}
              </p>
              <p>Phone: {savedAddress.phone}</p>
              <Button
                onClick={() => {
                  setAddress(savedAddress);
                  setShowAddressDialog(false);
                }}
              >
                Use This Address
              </Button>
            </div>
          ))}
          <Button onClick={() => setShowAddressDialog(false)}>
            Enter New Address
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
