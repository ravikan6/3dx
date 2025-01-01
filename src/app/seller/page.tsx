'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from 'lucide-react'

export default function SellerLogin() {
  const [formData, setFormData] = useState({
    sellerId: '',
    emailOrContact: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Store className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-black">Seller Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sellerId" className="text-sm font-medium text-gray-700">Seller ID</Label>
              <Input
                id="sellerId"
                type="text"
                placeholder="Enter your seller ID"
                value={formData.sellerId}
                onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                required
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailOrContact" className="text-sm font-medium text-gray-700">Email or Contact Number</Label>
              <Input
                id="emailOrContact"
                type="text"
                placeholder="Enter your email or contact number"
                value={formData.emailOrContact}
                onChange={(e) => setFormData({ ...formData, emailOrContact: e.target.value })}
                required
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

