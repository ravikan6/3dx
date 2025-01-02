"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchUserAddress, fetchUserDetails } from "@/utils/api";

type Address = {
  id: number;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
};

type ProfileData = {
  name: string;
};

export default function MyProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({ name: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [userDetails, userAddress] = await Promise.all([
          fetchUserDetails(userId),
          fetchUserAddress(userId),
        ]);

        setProfileData({
          name: userDetails.name,
        });

        setAddresses(userAddress.map((addr: any) => ({
          id: addr.id,
          streetAddress: addr.streetAddress,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          phoneNumber: addr.phoneNumber,
        })));
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-lg overflow-hidden"
        >
          <div className="pt-8 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">
                  Manage your account details and preferences
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Display Profile Name */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {profileData.name}
                </p>
              </div>

              {/* Display Address Details */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Address Saved
                </h2>
                {addresses.map((address) => (
                  <div key={address.id} className="mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Street Address:</strong> {address.streetAddress}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>City:</strong> {address.city}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>State:</strong> {address.state}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Pincode:</strong> {address.pincode}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Phone Number:</strong> {address.phoneNumber}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Security
                </h2>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Change Password
                </button>
              </div>
            </motion.div>

            <div className="mt-8">
              <Link
                href={{
                  pathname: "/signup",
                  query: {
                    name: profileData.name,
                  },
                }}
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                Go to Signup Page
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
