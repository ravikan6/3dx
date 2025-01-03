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

type Coupon = {
  id: number;
  code: string;
  name: string;
  discountPercentage: number;
  status: "active" | "expired";
  createdAt: string;
  updatedAt: string;
};

export default function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "expired">("active");
  const [filter, setFilter] = useState<string>("all");
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/coupon/get-coupons"
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.couponss)) {
        setCoupons(data.couponss);
      } else {
        console.error("Fetched data is not in the expected format:", data);
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }
  };

  const generateCouponCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(code);
  };

  const saveCoupon = async () => {
    if (code && name && discountPercentage > 0) {
      try {
        const response = await fetch(
          "https://backend3dx.onrender.com/coupon/save-coupons",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, name, discountPercentage, status }),
          }
        );
        if (response.ok) {
          fetchCoupons();
          resetForm();
        } else {
          console.error("Failed to save coupon");
        }
      } catch (error) {
        console.error("Error saving coupon:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const updateCouponStatus = async (
    couponCode: string,
    newStatus: "active" | "expired"
  ) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/coupon/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: couponCode, status: newStatus }),
        }
      );
      if (response.ok) {
        fetchCoupons();
      } else {
        console.error("Failed to update coupon status");
      }
    } catch (error) {
      console.error("Error updating coupon status:", error);
    }
  };

  const deleteCoupon = async (couponCode: string) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/coupon/delete-coupons",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: couponCode }),
        }
      );
      if (response.ok) {
        fetchCoupons();
      } else {
        console.error("Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setDiscountPercentage(0);
    setStatus("active");
    setIsFormVisible(false);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (filter === "active") {
      return coupon.status === "active";
    } else if (filter === "expired") {
      return coupon.status === "expired";
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
            <h1 className="text-3xl font-semibold text-gray-800">Coupons</h1>
            <p className="text-sm text-gray-600">
              Manage your coupons and promotions effectively.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-gray-200" : ""}
            >
              All Coupons
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-gray-200" : ""}
            >
              Active Coupons
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter("expired")}
              className={filter === "expired" ? "bg-gray-200" : ""}
            >
              Expired Coupons
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormVisible(true)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Coupon <Plus className="ml-2" />
            </Button>
          </div>
        </div>

        {isFormVisible && (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add Coupon
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={generateCouponCode}>Generate</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Name/Purpose
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter coupon name or purpose"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) =>
                    setDiscountPercentage(Number(e.target.value))
                  }
                  placeholder="Enter discount percentage"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  onValueChange={(value: "active" | "expired") =>
                    setStatus(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={saveCoupon}
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Coupon
            </Button>
            <Button
              onClick={resetForm}
              className="w-full mt-2 bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Coupon List
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.length === 0 ? (
              <p className="text-gray-500">No coupons matching the filter.</p>
            ) : (
              filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {coupon.code}
                      </p>
                      <p className="text-sm text-gray-500">
                        Discount: {coupon.discountPercentage}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {coupon.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(coupon.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Updated:{" "}
                        {new Date(coupon.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Select
                        onValueChange={(value: "active" | "expired") =>
                          updateCouponStatus(coupon.code, value)
                        }
                        defaultValue={coupon.status}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCoupon(coupon.code)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
