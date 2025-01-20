"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Package } from "lucide-react";  // Import Gift and Package icons

const GiftPage = () => {
  const [giftName, setGiftName] = useState<string>("");
  const [giftDescription, setGiftDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle gift sending action
  const handleSendGift = async (): Promise<void> => {
    if (!giftName || !recipient || !quantity || !giftDescription) {
      setError("Please fill in all gift details.");
      return;
    }

    try {
      const response = await fetch("https://your-backend-api.com/send-gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftName,
          giftDescription,
          quantity,
          recipient,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");  // Clear the error if the request is successful
        alert("Gift sent successfully!");
      } else {
        setError(data.message || "Failed to send gift. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Package className="h-6 w-6 text-black" /> {/* Display Package icon */}
          </div>
          <CardTitle className="text-2xl font-bold text-center text-black">
            Send a Gift
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4">
            {/* Gift Name */}
            <div className="space-y-2">
              <Label htmlFor="giftName" className="text-sm font-medium text-gray-700">
                Gift Name
              </Label>
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4 text-gray-700" />  {/* Display Gift icon */}
                <Input
                  id="giftName"
                  type="text"
                  placeholder="Enter gift name"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Gift Description */}
            <div className="space-y-2">
              <Label htmlFor="giftDescription" className="text-sm font-medium text-gray-700">
                Gift Description
              </Label>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-700" />
                <Input
                  id="giftDescription"
                  type="text"
                  placeholder="Enter gift description"
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </Label>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-700" />
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                Recipient Name
              </Label>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-700" />
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient's name"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Send Gift Button */}
            <Button
              type="button"
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={handleSendGift}
            >
              Send Gift
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftPage;
