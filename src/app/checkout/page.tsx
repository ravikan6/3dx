"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartItem, Address, OrderCalculation, OrderedProduct } from './types';

const GiftPage: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

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

  const handleGiftMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setGiftMessage(e.target.value);
  };

  const handleRecipientNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRecipientName(e.target.value);
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

  const handleGiftOrder = async (): Promise<void> => {
    if (!recipientName || !giftMessage) {
      alert("Please provide recipient's name and gift message.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;

      const { total } = calculateTotal();

      const orderedProducts: OrderedProduct[] = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));

      const orderResponse = await fetch('https://backend3dx.onrender.com/order/create-gift-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          userId,
          orderedProducts,
          recipientName,
          giftMessage
        })
      });

      const orderData = await orderResponse.json();
      if (orderData.success) {
        handleGiftOrderSuccess();
      }
    } catch (error) {
      console.error('Error processing gift order:', error);
      alert('Error processing your gift order. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleGiftOrderSuccess = (): void => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/gift-orders');  // Redirect to gift orders page
    }, 5000);
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
          {/* Gift Information Section */}
          <div className="md:w-2/3 bg-white rounded-2xl p-8">
            <div className="flex items-center mb-6 space-x-4">
              <h2 className="text-2xl font-normal tracking-widest">GIFTING DETAILS</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient's Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={handleRecipientNameChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gift Message</label>
                <input
                  type="text"
                  value={giftMessage}
                  onChange={handleGiftMessageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                />
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
                onClick={handleGiftOrder}
                disabled={!recipientName || !giftMessage || paymentProcessing}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg transition-all duration-300 ${
                  recipientName && giftMessage && !paymentProcessing
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                }`}
              >
                {paymentProcessing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-pink-600"></div>
                ) : (
                  <Gift size={20} />
                )}
                <span className="text-xl font-semibold">Gift this Item</span>
              </button>
            </div>

            {showSuccess && (
              <div className="mt-6 flex justify-center items-center text-green-500 font-semibold">
                <CheckCircle size={32} />
                <span>Your gift order has been successfully placed!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftPage;
