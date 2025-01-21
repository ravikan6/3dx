"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Complaint, SortConfig } from "@/types/complaints";

interface ComplaintsTableProps {
  complaints: Complaint[];
  onStatusChange: (complaintId: string, newStatus: string) => void;
}

export function ComplaintsTable({ complaints, onStatusChange }: ComplaintsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key: keyof Complaint) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedComplaints = useMemo(() => {
    if (!Array.isArray(complaints)) return [];

    const sortableComplaints = [...complaints];
    if (sortConfig.key !== null) {
      sortableComplaints.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableComplaints;
  }, [complaints, sortConfig]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black-100 border-b border-black-200">
            <tr>
              {[
                { key: "complaintNumber", label: "Complaint ID" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "message", label: "Message" },
                { key: "userType", label: "User Type" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Created At" },
                { key: null, label: "Actions" },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  onClick={() => key && handleSort(key as keyof Complaint)}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    key ? "cursor-pointer hover:bg-black-200 transition-colors" : ""
                  }`}
                >
                  <div className="flex items-center">
                    {label}
                    {key && <ArrowUpDown size={14} className="ml-2 text-black-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedComplaints.map((complaint) => (
              <tr
                key={complaint.complaintNumber}
                className="hover:bg-black-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {complaint.complaintNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {complaint.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {complaint.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {complaint.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {complaint.userType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      complaint.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {complaint.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center px-3 py-2 bg-black-100 text-black-700 rounded-lg hover:bg-black-200 transition-colors"
                      >
                        Update Status <ChevronDown size={16} className="ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(complaint.complaintNumber, "Pending")}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(complaint.complaintNumber, "Resolved")}
                      >
                        Resolved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComplaintsTable;
