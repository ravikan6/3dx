"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Gift = {
  id: number;
  code: string;
  name: string;
  value: number;
  status: "active" | "expired";
  createdAt: string;
  updatedAt: string;
};

export default function GiftPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "expired">("active");
  const [filter, setFilter] = useState<string>("all");
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const verifySeller = async () => {
      try {
        const sellerId = localStorage.getItem("sellerId");

        if (!sellerId) {
          router.push("/seller");
          return;
        }

        const response = await fetch("https://backend3dx.onrender.com/admin/verify-seller", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sellerId }),
        });

        const data = await response.json();

        if (!response.ok || data.loggedIn !== "loggedin") {
          router.push("/seller");
        }
      } catch (error) {
        console.error("Error verifying seller:", error);
        router.push("/seller");
      }
    };

    verifySeller();
  }, [router]);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/gift/get-gifts"
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.gifts)) {
        setGifts(data.gifts);
      } else {
        console.error("Fetched data is not in the expected format:", data);
        setGifts([]);
      }
    } catch (error) {
      console.error("Error fetching gifts:", error);
      setGifts([]);
    }
  };

  const generateGiftCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(code);
  };

  const saveGift = async () => {
    if (code && name && value > 0) {
      try {
        const response = await fetch(
          "https://backend3dx.onrender.com/gift/save-gift",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, name, value, status }),
          }
        );
        if (response.ok) {
          fetchGifts();
          resetForm();
        } else {
          console.error("Failed to save gift");
        }
      } catch (error) {
        console.error("Error saving gift:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const updateGiftStatus = async (
    giftCode: string,
    newStatus: "active" | "expired"
  ) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/gift/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: giftCode, status: newStatus }),
        }
      );
      if (response.ok) {
        fetchGifts();
      } else {
        console.error("Failed to update gift status");
      }
    } catch (error) {
      console.error("Error updating gift status:", error);
    }
  };

  const deleteGift = async (giftCode: string) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/gift/delete-gift",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: giftCode }),
        }
      );
      if (response.ok) {
        fetchGifts();
      } else {
        console.error("Failed to delete gift");
      }
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setValue(0);
    setStatus("active");
    setIsFormVisible(false);
  };

  const filteredGifts = gifts.filter((gift) => {
    if (filter === "active") {
      return gift.status === "active";
    } else if (filter === "expired") {
      return gift.status === "expired";
    } else {
      return true;
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Gifts</h1>
            <p className="text-sm text-gray-600">
              Manage your gifts and promotions effectively.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-gray-200" : ""}
            >
              All Gifts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-gray-200" : ""}
            >
              Active Gifts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("expired")}
              className={filter === "expired" ? "bg-gray-200" : ""}
            >
              Expired Gifts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormVisible(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Gift <Plus className="ml-2" />
            </Button>
          </div>
        </div>

        {isFormVisible && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Gift
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter gift code"
                    className="flex-1 p-3 border border-gray-300 rounded-md
