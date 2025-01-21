import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoIcon } from 'lucide-react';

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Product Overview Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Product overview</h3>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <select className="text-sm bg-transparent border-none outline-none">
            <option>This month</option>
          </select>
        </div>
        <div className="mb-6">
          <div className="text-2xl font-bold mb-1">₹43,630</div>
          <p className="text-xs text-muted-foreground">Total sales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            Cosmetics
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Housewell
          </Button>
        </div>
      </Card>

      {/* Active Sales Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Active sales</h3>
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

      {/* Product Revenue Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Product Revenue</h3>
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
  );
}

export default OverviewCards;
