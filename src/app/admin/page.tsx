"use client";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/component/admin/header/header"
import { OverviewCards } from "@/component/admin/dashboard/overview-cards"
import { AnalyticsChart } from "@/component/admin/dashboard/analytics-chart.tsx"
import { TopProducts } from "@/component/admin/dashboard/top-products"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"

export default function Dashboard() {
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
              <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Track your sales and performance of your strategy
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/add-product`}>
                <Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
          <OverviewCards />
          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsChart />
            <TopProducts />
          </div>
        </main>
      </div>
    </div>
  )
}