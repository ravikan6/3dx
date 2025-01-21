'use client';

import { useState } from "react";
import { Sidebar } from "@/component/admin/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Coupon = {
  id: string;
  name: string;
  discount: number;
  expiryDate: string;
};

export default function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [name, setName] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const addCoupon = () => {
    if (name && discount > 0 && expiryDate) {
      const newCoupon: Coupon = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        discount,
        expiryDate,
      };
      setCoupons([...coupons, newCoupon]);
      resetForm();
    } else {
      alert("Please fill in all fields.");
    }
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setName(coupon.name);
    setDiscount(coupon.discount);
    setExpiryDate(coupon.expiryDate);
    setIsFormVisible(true);
  };

  const updateCoupon = () => {
    if (editingCoupon) {
      const updatedCoupons = coupons.map((coupon) =>
        coupon.id === editingCoupon.id
          ? { ...coupon, name, discount, expiryDate }
          : coupon
      );
      setCoupons(updatedCoupons);
      resetForm();
    }
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
  };

  const resetForm = () => {
    setName("");
    setDiscount(0);
    setExpiryDate("");
    setIsFormVisible(false);
    setEditingCoupon(null);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const isExpired = new Date(coupon.expiryDate) < new Date();
    if (filter === "active") {
      return !isExpired;
    } else if (filter === "expired") {
      return isExpired;
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
              {editingCoupon ? "Edit Coupon" : "Add Coupon"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter coupon name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="Enter discount percentage"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button
              onClick={editingCoupon ? updateCoupon : addCoupon}
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingCoupon ? "Update Coupon" : "Save Coupon"}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Discount: {coupon.discount}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires: {coupon.expiryDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        color="blue"
                        onClick={() => editCoupon(coupon)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        color="red"
                        onClick={() => deleteCoupon(coupon.id)}
                      >
                        Delete
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
