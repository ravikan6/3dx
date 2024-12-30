import { Card } from "@/components/ui/card"
import { InfoIcon } from 'lucide-react'

const products = [
  {
    name: "Bird Shorts",
    sales: "197 pcs",
    revenue: "₹1,890",
    stock: "100",
    status: "In stock",
  },
  {
    name: "T-Shirts, Max",
    sales: "540 pcs",
    revenue: "₹2,889",
    stock: "100",
    status: "Out of stock",
  },
]

export function TopProducts() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Top Products</h3>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-5 text-xs text-muted-foreground">
          <div>Product</div>
          <div>Sales</div>
          <div>Revenue</div>
          <div>Stock</div>
          <div>Status</div>
        </div>
        {products.map((product) => (
          <div key={product.name} className="grid grid-cols-5 text-sm">
            <div>{product.name}</div>
            <div>{product.sales}</div>
            <div>{product.revenue}</div>
            <div>{product.stock}</div>
            <div className={product.status === "Out of stock" ? "text-red-500" : "text-green-500"}>
              {product.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

