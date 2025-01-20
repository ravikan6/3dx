import { Card } from "@/components/ui/card"
import { InfoIcon } from 'lucide-react'

const gifts = [
  {
    name: "Gift Basket",
    sales: "197 pcs",
    revenue: "₹1,890",
    stock: "50",
    status: "In stock",
  },
  {
    name: "Customized Mug",
    sales: "540 pcs",
    revenue: "₹2,889",
    stock: "0",
    status: "Out of stock",
  },
]

export function TopGifts() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Top Gifts</h3>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-5 text-xs text-muted-foreground">
          <div>Gift</div>
          <div>Sales</div>
          <div>Revenue</div>
          <div>Stock</div>
          <div>Status</div>
        </div>
        {gifts.map((gift) => (
          <div key={gift.name} className="grid grid-cols-5 text-sm">
            <div>{gift.name}</div>
            <div>{gift.sales}</div>
            <div>{gift.revenue}</div>
            <div>{gift.stock}</div>
            <div className={gift.status === "Out of stock" ? "text-red-500" : "text-green-500"}>
              {gift.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
