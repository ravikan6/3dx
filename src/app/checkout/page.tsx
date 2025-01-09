"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartItem, Address, OrderCalculation, RazorpayOrder, PaymentResponse, OrderedProduct } from './types';

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
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [saveAddress, setSaveAddress] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('savedShippingAddress');
    const savedSaveAddressPreference = localStorage.getItem('saveAddressPreference');
    
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress as Address);
      } catch (error) {
        console.error('Error parsing saved address:', error);
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
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      const cartResponse = await fetch('https://backend3dx.onrender.com/cart/get-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const cartData = await cartResponse.json();

      if (!cartData.success) {
        setLoading(false);
        return;
      }

      const productsInCart = JSON.parse(cartData.cart.productsInCart);
      const productPromises = productsInCart.map(async (item: any) => {
        const productResponse = await fetch(`https://backend3dx.onrender.com/product/product/${item.productId}`);
        const productData = await productResponse.json();
        
        if (productData.success) {
          return {
            ...productData.product,
            quantity: item.productQty,
            price: productData.product.productPrice,
            img: productData.product.img,
            name: productData.product.productName
          };
        }
        return null;
      });

      const products = await Promise.all(productPromises);
      setCartItems(products.filter((product): product is CartItem => product !== null));
    } catch (err) {
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const updatedAddress = {
      ...address,
      [name]: value
    };
    
    setAddress(updatedAddress);

    if (saveAddress) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(updatedAddress));
    }
  };

  const handleSaveAddressToggle = (e: ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setSaveAddress(isChecked);
    localStorage.setItem('saveAddressPreference', JSON.stringify(isChecked));

    if (isChecked) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(address));
    } else {
      localStorage.removeItem('savedShippingAddress');
    }
  };

  const isAddressValid = (): boolean => {
    return Object.values(address).every(value => value.trim() !== '');
  };

  const calculateTotal = (): OrderCalculation => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    const shippingCharges = subtotal > 499 ? 0 : 60;
    return {
      subtotal,
      shippingCharges,
      total: subtotal + shippingCharges
    };
  };

  const initializeRazorpayOrder = async (userId: string, amount: number): Promise<RazorpayOrder> => {
    try {
      const orderedProducts: OrderedProduct[] = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));

      const response = await fetch('https://backend3dx.onrender.com/order/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          userId,
          orderedProducts
        })
      });

      const data = await response.json();
      return data.razorpayOrder;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handlePayment = async (razorpayOrder: RazorpayOrder): Promise<void> => {
    const options = {
      key: 'rzp_test_x85nFUVKff8ZPy',
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Your Store Name',
      description: 'Purchase Payment',
      order_id: razorpayOrder.id,
      handler: async (response: PaymentResponse) => {
        try {
          const verificationResponse = await fetch('https://backend3dx.onrender.com/order/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            await handlePlaceOrder(response.razorpay_order_id, response.razorpay_payment_id);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: address.phone
      },
      theme: {
        color: '#000000'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePlaceOrder = async (razorpayOrderId: string, paymentId: string): Promise<void> => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;
    
    setPaymentProcessing(true);
    
    try {
      const { total } = calculateTotal();
      const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}, ${address.phone}`;

      const orderResponse = await fetch('https://backend3dx.onrender.com/order/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          address: fullAddress,
          amount: total,
          orderedProducts: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })),
          paymentStatus: "Paid",
          razorpayOrderId,
          paymentId
        })
      });

      const orderData = await orderResponse.json();
      if (orderData.success) {
        handleOrderSuccess();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleOrderSuccess = (): void => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/orders');
    }, 5000);
  };

  const initiatePayment = async (): Promise<void> => {
    if (!isAddressValid()) return;

    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    try {
      const { total } = calculateTotal();
      const razorpayOrder = await initializeRazorpayOrder(userId, total);
      await handlePayment(razorpayOrder);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Unable to initialize payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  const { subtotal, shippingCharges, total } = calculateTotal();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-14 mt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Address Section */}
          <div className="md:w-2/3 bg-white rounded-2xl p-8">
            <div className="flex items-center mb-6 space-x-4">
              <h2 className="text-2xl font-normal tracking-widest">SHIPPING DETAILS</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                />
              </div>
              
              <div className="md:col-span-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={handleSaveAddressToggle}
                  className="text-pink-600 focus:ring-pink-500 rounded"
                />
                <label htmlFor="saveAddress" className="text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="md:w-1/3 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6 space-x-4">
              <h2 className="text-4xl font-thin">Order Summary</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.img[0]} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shippingCharges === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `Rs. ${shippingCharges.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Total</span>
                <span className="font-thin tracking-widest">Rs. {total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={initiatePayment}
                disabled={!isAddressValid() || paymentProcessing}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg transition-all duration-300 ${
                  isAddressValid() && !paymentProcessing
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                {paymentProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email shortly with your order details.
            </p>
            <button 
              onClick={() => router.push('/orders')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      )}
      <script
        src="https://checkout.razorpay.com/v1/checkout.js"
        async
      />
    </div>
  );
};

export default Checkout;