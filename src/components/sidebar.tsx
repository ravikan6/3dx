import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Mail, BarChart2, Link2, TrendingUp, User, Users2, Settings, MessageCircle } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Order
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
                <span className="ml-auto text-xs bg-muted px-1.5 rounded-md">22</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-3">OTHER</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Link2 className="mr-2 h-4 w-4" />
                Integration
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <TrendingUp className="mr-2 h-4 w-4" />
                Performance
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-3">ACCOUNT</h3>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Users2 className="mr-2 h-4 w-4" />
                Members
              </Button>
              <Button variant="ghost" className="w-full justify-start h-9 px-2 text-sm font-normal">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
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

