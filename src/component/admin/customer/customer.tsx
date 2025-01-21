'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Sidebar from '@/component/admin/sidebar/sidebar';

interface Customer {
  userId: string;
  name: string;
  email: string;
  accountStatus: 'open' | 'suspended' | 'blocked';
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer | null; direction: 'ascending' | 'descending' }>({
    key: null,
    direction: 'ascending',
  });
  const [newCustomer, setNewCustomer] = useState<Customer>({
    userId: '',
    name: '',
    email: '',
    accountStatus: 'open',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-user`);
      const data = await response.json();
      if (data.success) {
        setCustomers(
          data.users.map((user: any) => ({
            userId: user.userId || '',
            name: user.name || '',
            email: user.email || '',
            accountStatus: user.accountStatus || 'open',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSort = (key: keyof Customer) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/update-account-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, accountStatus: newStatus }),
      });

      if (response.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.userId === userId ? { ...customer, accountStatus: newStatus } : customer
          )
        );
      }
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  const handleAddCustomer = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/add-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        fetchCustomers(); // Refresh customers list after adding
        setNewCustomer({ userId: '', name: '', email: '', accountStatus: 'open' }); // Clear the form
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const sortedCustomers = useMemo(() => {
    if (!sortConfig.key) return customers;
    return [...customers].sort((a, b) => {
      const aValue = String(a[sortConfig.key as keyof Customer] || '').toLowerCase();
      const bValue = String(b[sortConfig.key as keyof Customer] || '').toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [customers, sortConfig]);

  const filteredCustomers = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return sortedCustomers.filter(
      (customer) =>
        customer.userId.toLowerCase().includes(lowerSearchQuery) ||
        customer.name.toLowerCase().includes(lowerSearchQuery) ||
        customer.email.toLowerCase().includes(lowerSearchQuery)
    );
  }, [sortedCustomers, searchQuery]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-gray-50 min-h-screen">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <Input
              placeholder="Search by user ID, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2"
            />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border mb-6">
              <Input
                placeholder="User ID"
                value={newCustomer.userId}
                onChange={(e) => setNewCustomer({ ...newCustomer, userId: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="mb-2"
              />
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {['userId', 'name', 'email', 'accountStatus'].map((header, index) => (
                      <TableHead
                        key={index}
                        onClick={() => handleSort(header as keyof Customer)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          {header.charAt(0).toUpperCase() + header.slice(1)}
                          <ArrowUpDown size={14} className="ml-1" />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.userId}>
                        <TableCell>{customer.userId}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          <select
                            value={customer.accountStatus}
                            onChange={(e) => handleStatusChange(customer.userId, e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            <option value="open">Open</option>
                            <option value="suspended">Suspended</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomersPage;
