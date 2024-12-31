'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Sidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white transition-all duration-300',
        isCollapsed ? 'w-12' : 'w-64',
        className
      )}
    >
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">3D</span>
            </div>
            {!isCollapsed && (
              <h2 className="text-sm font-semibold">3D.xyz</h2>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform" />
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                MAIN MENU
              </h3>
            )}
            <div className="space-y-1">
              {[
                { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                { href: '/admin/products', icon: Package, label: 'Products' },
                { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
                { href: '/admin/complaints', icon: MessageCircle, label: 'Complaints' },
                { href: '/admin/customers', icon: Users, label: 'Customers' },
                { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
              ].map((item) => (
                <Link href={item.href} passHref key={item.label}>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      'w-full justify-start h-9 px-2 text-sm font-normal flex items-center',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!isCollapsed && item.label}
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
              'w-full justify-center h-9 px-2 text-sm font-normal mb-2 inline-flex items-center text-muted-foreground'
            )}
          >
            Add Product
          </motion.a>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <div>
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </>
            )}
          </div>
          <MessageCircle
            className={cn(
              'h-4 w-4 text-muted-foreground',
              isCollapsed && 'mx-auto'
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
