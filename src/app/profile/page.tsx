"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchUserAddress, fetchUserDetails } from "@/utils/api";
import PersonalInformation from "./PersonalInformation";
import ShippingAddresses from "./ShippingAddresses";

type Address = {
  id: string;
  type: string;
  address: string;
  isDefault: boolean;
};

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  shippingAddresses: Address[];
};

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    shippingAddresses: [],
  });
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
          email: userDetails.email,
          phone: userDetails.phone || "",
          shippingAddresses: userAddress.addresses.map((addr: any) => ({
            id: addr.id,
            type: addr.type || "Home",
            address: `${addr.streetAddress}, ${addr.city}, ${addr.state}, ${addr.pincode}`,
            isDefault: addr.isDefault || false,
          })),
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSaveProfile = () => {
    // Logic to handle profile update
    console.log("Profile updated:", profileData);
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

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
              <button
                onClick={() => {
                  if (isEditing) onSaveProfile();
                  else setIsEditing(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <PersonalInformation
                profileData={profileData}
                setProfileData={setProfileData}
                isEditing={isEditing}
              />

              <ShippingAddresses
                addresses={profileData.shippingAddresses}
                isEditing={isEditing}
              />

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
                    email: profileData.email,
                    phone: profileData.phone,
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

