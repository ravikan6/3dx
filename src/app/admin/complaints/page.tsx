"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ComplaintsTable } from "@/component/admin/Table/complaints-table";
import { Input } from "@/components/ui/input";
import { Complaint } from "@/types/complaints";
import {Sidebar} from "@/components/sidebar"; // Import the Sidebar component
import { useRouter } from "next/navigation";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter()

  useEffect(() => {
    const verifySeller = async () => {
      try {
        const sellerId = localStorage.getItem('sellerId') 
        
        if (!sellerId) {
          router.push('/seller')
          return
        }

        const response = await fetch('https://backend3dx.onrender.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        })

        const data = await response.json()

        if (!response.ok || data.loggedIn !== 'loggedin') {
          router.push('/seller')
        }
      } catch (error) {
        console.error('Error verifying seller:', error)
        router.push('/seller')
      }
    }

    verifySeller()
  }, [router])

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/complaints/get-complaints"
      );
      const data = await response.json();
      setComplaints(data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/update-complaint-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        fetchComplaints();
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.complaintNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen">
        <div className="hidden w-64 border-r bg-white md:block">
      <Sidebar />
      </div>
      {/* Table Section */}
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="container mx-auto">
          {/* Search Section */}
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-black-400" size={20} />
              </div>
              <Input
                type="text"
                placeholder="Search by complaint ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-300 bg-white shadow-sm transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Complaints Table */}
          <ComplaintsTable
            complaints={filteredComplaints}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}