import { LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Mail, BarChart2, Link2, TrendingUp, User, Users2, Settings, MessageCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">V</span>
          </div>
          <h2 className="text-sm font-semibold">
            Veselty Inc.
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-3">MAIN MENU</h3>
            <div className="space-y-1">
              <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              </Link>
              <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
              </Link>
              <Link href="/admin/order">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Order
              </Button>
              </Link>
             <Link href="/admin/coupons">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <MessageSquare className="mr-2 h-4 w-4" />
                Coupons
              </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-3">USER EXPERIENCE</h3>
            <div className="space-y-1">
              <Link href="/admin/complaints">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Mail className="mr-2 h-4 w-4" />
                Complaints
              </Button>
              </Link>
              <Link href="/admin/customers">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <BarChart2 className="mr-2 h-4 w-4" />
                Users
              </Button>
              </Link>
              
            </div>
          </div>

          
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Jevine klof</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

