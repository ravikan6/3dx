"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Mail, Phone, Lock } from 'lucide-react'

export default function SellerLogin() {
  const [formData, setFormData] = useState({
    sellerId: '',
    contactOption: 'email', // default selection
    email: '',
    mobile: '',
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
              <div className="flex items-center space-x-2">
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
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contact Option</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contactOption"
                    value="email"
                    checked={formData.contactOption === 'email'}
                    onChange={(e) => setFormData({ ...formData, contactOption: e.target.value, mobile: '' })}
                  />
                  <span className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-gray-700" />
                    <span>Email</span>
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="contactOption"
                    value="mobile"
                    checked={formData.contactOption === 'mobile'}
                    onChange={(e) => setFormData({ ...formData, contactOption: e.target.value, email: '' })}
                  />
                  <span className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-700" />
                    <span>Mobile Number</span>
                  </span>
                </label>
              </div>
            </div>

            {formData.contactOption === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-700" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            )}

            {formData.contactOption === 'mobile' && (
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-700" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-700" />
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
