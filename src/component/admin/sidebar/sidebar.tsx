"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex flex-col h-full bg-white overflow-hidden", className)}
    >
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">3D</span>
            </div>
            <h2 className="text-sm font-semibold">3D.xyz</h2>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              MAIN MENU
            </h3>
            <div className="space-y-1">
              {[
                { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
                { href: "/admin/products", icon: Package, label: "Products" },
                { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
                {
                  href: "/admin/complaints",
                  icon: MessageCircle,
                  label: "Complaints",
                },
                { href: "/admin/customers", icon: Users, label: "Customers" }, // Customers page route added
                { href: "/admin/coupons", icon: Tag, label: "Coupons" },
              ].map((item) => (
                <Link href={item.href} passHref key={item.label}>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "w-full justify-start h-9 px-2 text-sm font-normal flex items-center",
                      pathname === item.href && "bg-gray-200 text-black"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        pathname === item.href
                          ? "text-blue-600"
                          : "text-muted-foreground"
                      )}
                    />
                    {item.label}
                  </motion.a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-2 border-t">
        <Link href="/admin/add-product" passHref>
          <motion.a
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-full justify-center h-9 px-2 text-sm font-normal mb-2 inline-flex items-center text-muted-foreground"
            )}
          >
            Add Product
          </motion.a>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
