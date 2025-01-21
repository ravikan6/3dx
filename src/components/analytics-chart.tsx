'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfoIcon } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "JAN", value: 2000 },
  { name: "FEB", value: 2500 },
  { name: "MAR", value: 3000 },
  { name: "APR", value: 2800 },
  { name: "MAY", value: 4000 },
  { name: "JUN", value: 3500 },
  { name: "JUL", value: 4200 },
  { name: "AUG", value: 3800 },
]

export function AnalyticsChart() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Analytics</h3>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Filters
          </Button>
          <select className="text-sm bg-transparent border-none outline-none">
            <option>This year</option>
          </select>
        </div>
      </div>
      <div className="h-[300px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FF5A1F"
              strokeWidth={2}
              dot={{ fill: "#FF5A1F" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
