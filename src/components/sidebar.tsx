import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Mail,
  BarChart2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full bg-white shadow-md", className)}>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">3D</span>
          </div>
          <h2 className="text-sm font-semibold text-gray-800">3D.XYZ</h2>
        </div>

        {/* Main Menu */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-3">MAIN MENU</h3>
            <div className="space-y-1">
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Link href="/admin/order">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Order
                </Button>
              </Link>
              <Link href="/admin/coupons">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Coupons
                </Button>
              </Link>
            </div>
          </div>

          {/* User Experience */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-3">
              USER EXPERIENCE
            </h3>
            <div className="space-y-1">
              <Link href="/admin/complaints">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Complaints
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 text-sm font-normal text-gray-700 hover:bg-gray-100"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Users
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Jevine Klof</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <MessageCircle className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
