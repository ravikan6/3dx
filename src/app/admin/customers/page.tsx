'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { Gift, GiftsResponse } from '@/types/gift'
import { useRouter } from 'next/navigation'

export default function GiftManagementPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [sortField, setSortField] = useState<keyof Gift>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const router = useRouter()

  useEffect(() => {
    const verifySeller = async () => {
      try {
        const sellerId = localStorage.getItem('sellerId') 
        
        if (!sellerId) {
          router.push('/seller')
          return
        }

        const response = await fetch('https://backend3dx.onrender.com/admin/verify-seller', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        })

        const data = await response.json()

        if (!response.ok || data.loggedIn !== 'loggedin') {
          router.push('/seller')
        }
      } catch (error) {
        console.error('Error verifying seller:', error)
        router.push('/seller')
      }
    }

    verifySeller()
  }, [router])

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const response = await fetch('https://backend3dx.onrender.com/get-gifts')
      const data: GiftsResponse = await response.json()
      if (data.success) {
        setGifts(data.gifts)
      }
    } catch (error) {
      console.error('Error fetching gifts:', error)
    }
  }

  const updateGiftStatus = async (giftId: string, newStatus: string) => {
    try {
      const response = await fetch('https://backend3dx.onrender.com/update-gift-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftId,
          status: newStatus,
        }),
      })
      
      if (response.ok) {
        // Update local state
        setGifts(gifts.map(gift => 
          gift.giftId === giftId 
            ? { ...gift, status: newStatus as 'available' | 'redeemed' | 'expired' }
            : gift
        ))
      }
    } catch (error) {
      console.error('Error updating gift status:', error)
    }
  }

  const sortGifts = (field: keyof Gift) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedGifts = [...gifts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return 0
  })

  const SortButton = ({ field }: { field: keyof Gift }) => (
    <Button
      variant="ghost"
      onClick={() => sortGifts(field)}
      className="h-8 px-2"
    >
      {field.charAt(0).toUpperCase() + field.slice(1)}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="flex  h-screen">
      <div className="hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Gift Management</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><SortButton field="name" /></TableHead>
                <TableHead><SortButton field="description" /></TableHead>
                <TableHead><SortButton field="giftId" /></TableHead>
                <TableHead><SortButton field="value" /></TableHead>
                <TableHead>Status</TableHead>
                <TableHead><SortButton field="createdAt" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGifts.map((gift) => (
                <TableRow key={gift.giftId}>
                  <TableCell>{gift.name}</TableCell>
                  <TableCell>{gift.description}</TableCell>
                  <TableCell className="font-mono">{gift.giftId}</TableCell>
                  <TableCell>{gift.value}</TableCell>
                  <TableCell>
                    <Select
                      value={gift.status}
                      onValueChange={(value) => updateGiftStatus(gift.giftId, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="redeemed">Redeemed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(gift.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
