"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GiftPage() {
  const [recipientName, setRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Simulating sending gift request
      const payload = { recipientName, giftMessage, deliveryAddress, email };
      console.log("Sending gift with the following data:", payload);

      // Redirect to cart or another page upon success
      router.push("/cart");
    } catch (err) {
      setError("Failed to send gift. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-12 pt-8 pb-8 mb-4 transform transition-all hover:scale-105"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Send a Gift
          </h2>

          {/* Recipient Name */}
          <div className="mb-4">
            <Label
              htmlFor="recipientName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Recipient Name
            </Label>
            <Input
              type="text"
              id="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter recipient's name"
              required
            />
          </div>

          {/* Gift Message */}
          <div className="mb-4">
            <Label
              htmlFor="giftMessage"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Gift Message
            </Label>
            <Input
              type="text"
              id="giftMessage"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter a gift message"
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="mb-4">
            <Label
              htmlFor="deliveryAddress"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Delivery Address
            </Label>
            <Input
              type="text"
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the delivery address"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Your Email
            </Label>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-700" />
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Send Gift
            </Button>
          </div>

          {/* Redirect Link */}
          <div className="text-center mt-4">
            <Link
              href="/cart"
              className="inline-block align-baseline font-bold text-sm text-gray-800 hover:text-gray-700"
            >
              Go to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
