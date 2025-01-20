"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar"; // Import Sidebar component
import { useRouter } from "next/navigation";

interface Gift {
  id: string;
  recipient: string;
  giftItem: string;
  date: string;
  value: number;
  status: "pending" | "dispatched" | "delivered" | "cancelled";
}

const gifts: Gift[] = [
  {
    id: "GFT001",
    recipient: "Alice Johnson",
    giftItem: "Gift Hamper",
    date: "2024-01-02",
    value: 1500,
    status: "delivered",
  },
  {
    id: "GFT002",
    recipient: "Bob Smith",
    giftItem: "Flower Bouquet",
    date: "2024-01-01",
    value: 500,
    status: "pending",
  },
  {
    id: "GFT003",
    recipient: "Charlie Brown",
    giftItem: "Personalized Mug",
    date: "2024-01-01",
    value: 700,
    status: "dispatched",
  },
];

export default function GiftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Gift | null;
    direction: "ascending" | "descending";
  }>({
    key: "date",
    direction: "descending",
  });

  const router = useRouter();

  useEffect(() => {
    const verifySeller = async () => {
      try {
        const sellerId = localStorage.getItem("sellerId");

        if (!sellerId) {
          router.push("/seller");
          return;
        }

        const response = await fetch(
          "https://backend3dx.onrender.com/admin/verify-seller",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sellerId }),
          }
        );

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

  const handleSort = (key: keyof Gift) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const filteredGifts = useMemo(() => {
    return gifts
      .filter((gift) => {
        const matchesSearch =
          gift.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.giftItem.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || gift.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
  }, [gifts, searchQuery, statusFilter, sortConfig]);

  const getStatusColor = (status: Gift["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500";
      case "dispatched":
        return "bg-blue-500/10 text-blue-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="flex">
      <Sidebar className="w-64" />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gifts</h2>
            <p className="text-muted-foreground">
              Manage and track the gifts sent to recipients
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        Gift ID
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("recipient")}
                    >
                      <div className="flex items-center gap-1">
                        Recipient
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("giftItem")}
                    >
                      <div className="flex items-center gap-1">
                        Gift Item
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer text-right"
                      onClick={() => handleSort("value")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Value
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGifts.length > 0 ? (
                    filteredGifts.map((gift) => (
                      <TableRow key={gift.id}>
                        <TableCell className="font-medium">
                          {gift.id}
                        </TableCell>
                        <TableCell>{gift.recipient}</TableCell>
                        <TableCell>{gift.giftItem}</TableCell>
                        <TableCell>{gift.date}</TableCell>
                        <TableCell className="text-right">
                          ₹{gift.value.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(gift.status)}
                          >
                            {gift.status.charAt(0).toUpperCase() +
                              gift.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No gifts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
