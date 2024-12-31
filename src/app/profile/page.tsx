"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Enter Your Full Name",
    email: "example@gmail.com",
    phone: "+1 (555) 123-4567",
    address: "Enter Your Address",
    shippingAddresses: [
      {
        id: 1,
        type: "Home",
        address: "123 Main Street, Apt 4B, New York, NY 10001",
        isDefault: true,
      },
      {
        id: 2,
        type: "Office",
        address: "456 Business Ave, Suite 200, New York, NY 10002",
        isDefault: false,
      },
    ],
  });

  const onSaveProfile = () => {
    // Logic to handle profile update
    console.log("Profile updated:", profileData);
    alert("Profile updated successfully!");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm rounded-lg overflow-hidden"
        >
          {/* Profile Content */}
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
                  setIsEditing(!isEditing);
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

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="email"
                        disabled={!isEditing}
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Addresses */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Addresses
                </h2>
                <div className="space-y-4">
                  {profileData.shippingAddresses.map((address) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {address.address}
                            </p>
                          </div>
                        </div>
                        {isEditing && (
                          <button className="text-sm text-gray-600 hover:text-gray-900">
                            Edit
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isEditing && (
                    <button className="block w-full text-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-400">
                      + Add New Address
                    </button>
                  )}
                </div>
              </div>

              {/* Password Change Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Security
                </h2>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Change Password
                </button>
              </div>
            </motion.div>

            {/* Link to Signup Page */}
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
