'use client'

import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Calendar, Tag, Percent } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CouponPage from "@/component/admin/CouponPage/CouponPage"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface Coupon {
  id: number
  code: string
  discount: string
  type: 'Percentage' | 'Fixed'
  validFrom: string
  validUntil: string
  usageLimit: number
  usageCount: number
  status: 'Active' | 'Expired' | 'Scheduled'
}

const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'PRINT3D20',
    discount: '20%',
    type: 'Percentage',
    validFrom: '2024-01-01',
    validUntil: '2024-02-01',
    usageLimit: 100,
    usageCount: 45,
    status: 'Active'
  },
  {
    id: 2,
    code: 'NEWYEAR30',
    discount: '30%',
    type: 'Percentage',
    validFrom: '2024-01-01',
    validUntil: '2024-01-15',
    usageLimit: 50,
    usageCount: 23,
    status: 'Active'
  },
  {
    id: 3,
    code: 'FLAT500',
    discount: '₹500',
    type: 'Fixed',
    validFrom: '2024-01-01',
    validUntil: '2024-03-31',
    usageLimit: 200,
    usageCount: 76,
    status: 'Active'
  }
]

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCoupons = mockCoupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Coupon['status']) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Expired':
        return 'bg-red-100 text-red-800'
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddCoupon = () => {
    // Implement add coupon functionality
    console.log('Add new coupon')
  }

  const handleEditCoupon = (id: number) => {
    // Implement edit coupon functionality
    console.log('Edit coupon', id)
  }

  const handleDeleteCoupon = (id: number) => {
    // Implement delete coupon functionality
    console.log('Delete coupon', id)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Coupons</CardTitle>
              <CardDescription className="text-gray-600">Manage your 3D printing discount coupons</CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px] border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <Button onClick={handleAddCoupon} className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-5 w-5 mr-2" />
                Add New Coupon
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-500">Code</TableHead>
                  <TableHead className="text-gray-500">Discount</TableHead>
                  <TableHead className="text-gray-500">Type</TableHead>
                  <TableHead className="text-gray-500">Valid Period</TableHead>
                  <TableHead className="text-gray-500">Usage</TableHead>
                  <TableHead className="text-gray-500">Status</TableHead>
                  <TableHead className="text-gray-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map(coupon => (
                    <TableRow key={coupon.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{coupon.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Percent className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-900">{coupon.discount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{coupon.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-500">{coupon.validFrom} - {coupon.validUntil}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {coupon.usageCount}/{coupon.usageLimit}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                          {coupon.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCoupon(coupon.id)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="flex flex-col items-center py-4 text-gray-500">
                        <Tag className="h-12 w-12 mb-2 text-gray-400" />
                        No coupons found
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}