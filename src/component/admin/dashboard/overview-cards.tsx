import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfoIcon } from 'lucide-react'

export function GiftOverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Gifts Sold */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Gift Overview</h3>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <select className="text-sm bg-transparent border-none outline-none">
            <option>This month</option>
          </select>
        </div>
        <div className="mb-6">
          <div className="text-2xl font-bold mb-1">₹43,630</div>
          <p className="text-xs text-muted-foreground">Total gifts sold</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            Birthday Gifts
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Anniversary Gifts
          </Button>
        </div>
      </Card>

      {/* Active Gifts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Active Gifts</h3>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold mb-1">₹27,064</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            vs last month
            <span className="text-emerald-500">+5.6%</span>
          </p>
        </div>
      </Card>

      {/* Gift Revenue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Gift Revenue</h3>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold mb-1">₹16,568</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            vs last month
            <span className="text-emerald-500">+3.2%</span>
          </p>
        </div>
      </Card>
    </div>
  )
}
