"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Coupon = {
  name: string;
  code: string;
  discountPercentage: number;
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
    coupon: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("Please log in to proceed with checkout.");
      setLoading({ address: false, cart: false, payment: false, coupon: false });
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
    if (!saveAddress) return;

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

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingCharges = subtotal > 499 ? 0 : 60;
    let discountAmount = 0;

    if (appliedCoupon) {
      discountAmount = (subtotal * appliedCoupon.discountPercentage) / 100;
    }

    const total = subtotal - discountAmount + shippingCharges;

    return {
      subtotal,
      shippingCharges,
      discountAmount,
      total: Math.max(0, total), // Ensure total is not negative
    };
  };

  const handleCouponRedeem = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setLoading((prev) => ({ ...prev, coupon: true }));
    setCouponError(null);

    try {
      const response = await fetch("http://localhost:5000/coupon/verify-coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (!data.success) {
        setCouponError(data.message || "Failed to verify coupon.");
      } else if (data.message === "Coupons is valid and active") {
        setAppliedCoupon({
          name: data.coupons.name,
          code: data.coupons.code,
          discountPercentage: data.coupons.discountPercentage,
        });
        setCouponError(null);
      } else {
        setCouponError(data.message);
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setCouponError("An error occurred while verifying the coupon. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, coupon: false }));
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
      const { total } = calculateTotal();

      const orderPayload = {
        order_id: `order_${Date.now()}`,
        amount: total,
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        status: "created",
        userId: userId,
        orderedProducts: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        appliedCoupon: appliedCoupon,
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

  const { subtotal, shippingCharges, discountAmount, total } = calculateTotal();

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
          <div>
            <OrderSummary cartItems={cartItems} />
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Order Total</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>
                  {shippingCharges === 0 ? (
                    <span className="text-green-600">Free Shipping</span>
                  ) : (
                    `Rs.${shippingCharges.toFixed(2)}`
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount ({appliedCoupon.name}):</span>
                  <span>-Rs.{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>Rs.{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Apply Coupon</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button onClick={handleCouponRedeem} disabled={loading.coupon}>
                  {loading.coupon ? "Verifying..." : "Redeem"}
                </Button>
              </div>
              {couponError && <p className="text-red-500 mt-2">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-green-600 mt-2">
                  Coupon "{appliedCoupon.name}" applied successfully!
                </p>
              )}
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

