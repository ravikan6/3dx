import { Sidebar } from "@/component/admin/sidebar/sidebar"
import { Header } from "@/component/admin/header/header"
import { OverviewCards } from "@/component/admin/dashboard/overview-cards"
import { AnalyticsChart } from "@/component/admin/dashboard/analytics-chart.tsx"
import { TopProducts } from "@/component/admin/dashboard/top-products"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="hidden w-64 border-r bg-white md:block">
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
              <Button variant="outline" size="sm">
                Filters
              </Button>
              <Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Widget
              </Button>
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

