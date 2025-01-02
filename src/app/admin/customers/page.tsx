'use client'

import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { User, UsersResponse } from '@/types/customer'

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [sortField, setSortField] = useState<keyof User>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://backend3dx.onrender.com/get-user')
      const data: UsersResponse = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const updateAccountStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch('https://backend3dx.onrender.com/update-account-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountStatus: newStatus,
        }),
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.userId === userId 
            ? { ...user, accountStatus: newStatus as 'open' | 'suspended' | 'blocked' }
            : user
        ))
      }
    } catch (error) {
      console.error('Error updating account status:', error)
    }
  }

  const sortUsers = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return 0
  })

  const SortButton = ({ field }: { field: keyof User }) => (
    <Button
      variant="ghost"
      onClick={() => sortUsers(field)}
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
        <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><SortButton field="name" /></TableHead>
                <TableHead><SortButton field="email" /></TableHead>
                <TableHead><SortButton field="userId" /></TableHead>
                <TableHead><SortButton field="phone" /></TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead><SortButton field="createdAt" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono">{user.userId}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Select
                      value={user.accountStatus}
                      onValueChange={(value) => updateAccountStatus(user.userId, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
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

