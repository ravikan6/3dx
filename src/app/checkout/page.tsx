"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { CheckCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartItem, Address, OrderCalculation, RazorpayOrder, PaymentResponse, OrderedProduct } from "./types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [saveAddress, setSaveAddress] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem("savedShippingAddress");
    const savedSaveAddressPreference = localStorage.getItem("saveAddressPreference");

    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress as Address);
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }

    if (savedSaveAddressPreference) {
      setSaveAddress(JSON.parse(savedSaveAddressPreference));
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async (): Promise<void> => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
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
        setLoading(false);
        return;
      }

      const productsInCart = JSON.parse(cartData.cart.productsInCart);
      const productPromises = productsInCart.map(async (item: any) => {
        const productResponse = await fetch(
          `https://backend3dx.onrender.com/product/product/${item.productId}`
        );
        const productData = await productResponse.json();

        if (productData.success) {
          return {
            ...productData.product,
            quantity: item.productQty,
            price: productData.product.productPrice,
            img: productData.product.img,
            name: productData.product.productName,
          };
        }
        return null;
      });

      const products = await Promise.all(productPromises);
      setCartItems(products.filter((product): product is CartItem => product !== null));
    } catch (err) {
      console.error("Error fetching cart items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value,
    };

    setAddress(updatedAddress);

    if (saveAddress) {
      localStorage.setItem("savedShippingAddress", JSON.stringify(updatedAddress));
    }
  };

  const handleSaveAddressToggle = (e: ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setSaveAddress(isChecked);
    localStorage.setItem("saveAddressPreference", JSON.stringify(isChecked));

    if (isChecked) {
      localStorage.setItem("savedShippingAddress", JSON.stringify(address));
    } else {
      localStorage.removeItem("savedShippingAddress");
    }
  };

  const isAddressValid = (): boolean => {
    return Object.values(address).every((value) => value.trim() !== "");
  };

  const calculateTotal = (): OrderCalculation => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    const shippingCharges = subtotal > 499 ? 0 : 60;
    return {
      subtotal,
      shippingCharges,
      total: subtotal + shippingCharges,
    };
  };

  const initializeRazorpayOrder = async (userId: string, amount: number): Promise<RazorpayOrder> => {
    try {
      const orderedProducts: OrderedProduct[] = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const response = await fetch(
        "https://backend3dx.onrender.com/order/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            currency: "INR",
            userId,
            orderedProducts,
          }),
        }
      );

      const data = await response.json();
      return data.razorpayOrder;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  };

  const handlePayment = async (razorpayOrder: RazorpayOrder): Promise<void> => {
    const options = {
      key: "rzp_test_x85nFUVKff8ZPy",
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Your Store Name",
      description: "Purchase Payment",
      order_id: razorpayOrder.id,
      handler: async (response: PaymentResponse) => {
        try {
          const verificationResponse = await fetch(
            "https://backend3dx.onrender.com/order/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            await handlePlaceOrder(response.razorpay_order_id, response.razorpay_payment_id);
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: address.phone,
      },
      theme: {
        color: "#000000",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePlaceOrder = async (razorpayOrderId: string, paymentId: string): Promise<void> => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    setPaymentProcessing(true);

    try {
      const { total } = calculateTotal();
      const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}, ${address.phone}`;

      const orderResponse = await fetch(
        "https://backend3dx.onrender.com/order/place-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            address: fullAddress,
            amount: total,
            orderedProducts: cartItems.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
            })),
            paymentStatus: "Paid",
            razorpayOrderId,
            paymentId,
          }),
        }
      );

      const orderData = await orderResponse.json();
      if (orderData.success) {
        handleOrderSuccess();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleOrderSuccess = (): void => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/orders");
    }, 5000);
  };

  const initiatePayment = async (): Promise<void> => {
    if (!isAddressValid()) return;

    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const { total } = calculateTotal();
      const razorpayOrder = await initializeRazorpayOrder(userId, total);
      await handlePayment(razorpayOrder);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Unable to initialize payment. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {/* Address Form */}
      <div className="address-form">
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={handleAddressChange}
          placeholder="Street"
        />
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleAddressChange}
          placeholder="City"
        />
        <input
          type="text"
          name="state"
          value={address.state}
          onChange={handleAddressChange}
          placeholder="State"
        />
        <input
          type="text"
          name="pincode"
          value={address.pincode}
          onChange={handleAddressChange}
          placeholder="Pincode"
        />
        <input
          type="text"
          name="phone"
          value={address.phone}
          onChange={handleAddressChange}
          placeholder="Phone"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={handleSaveAddressToggle}
            />
            Save this address
          </label>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              {item.name} x {item.quantity} = ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p>Subtotal: ₹{calculateTotal().subtotal}</p>
        <p>Shipping Charges: ₹{calculateTotal().shippingCharges}</p>
        <p>Total: ₹{calculateTotal().total}</p>
      </div>

      {/* Payment */}
      <button onClick={initiatePayment} disabled={paymentProcessing}>
        {paymentProcessing ? "Processing..." : "Proceed to Payment"}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="payment-success">
          <CheckCircle color="green" /> Payment successful! Redirecting to orders...
        </div>
      )}
    </div>
  );
};

export default Checkout;
