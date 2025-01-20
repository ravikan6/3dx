"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/component/admin/header/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function GiftPage() {
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

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <div className="relative hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold mb-1">Gift Page</h1>
              <p className="text-sm text-muted-foreground">
                Explore and manage your exclusive gift items.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/add-gift`}>
                <Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Gift
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Add gift-related components or placeholders here */}
            <div className="bg-white p-4 rounded shadow">Gift Analytics Placeholder</div>
            <div className="bg-white p-4 rounded shadow">Top Gifts Placeholder</div>
          </div>
        </main>
      </div>
    </div>
  );
}
