'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfoIcon } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "JAN", value: 100 },
  { name: "FEB", value: 150 },
  { name: "MAR", value: 200 },
  { name: "APR", value: 180 },
  { name: "MAY", value: 250 },
  { name: "JUN", value: 220 },
  { name: "JUL", value: 270 },
  { name: "AUG", value: 240 },
]

export function GiftPage() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Gifts Overview</h3>
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
              tickFormatter={(value) => `${value} gifts`}
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
