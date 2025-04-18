'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Item } from '@/lib/types';

// Extended Job type for our mock data
interface Job {
  id: string;
  customerId: string;
  carrierId: string | null;
  items: Item[];
  pickupAddress: string;
  deliveryAddress: string; // Using deliveryAddress instead of dropoffAddress
  pickupTime: string;
  deliveryTime: string | null;
  status: 'requested' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  price: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for demo
const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    customerId: 'customer-123',
    carrierId: 'carrier-123',
    status: 'requested',
    pickupAddress: '123 Main St, San Francisco, CA',
    deliveryAddress: '456 Market St, San Francisco, CA',
    pickupTime: '2025-04-18T10:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Large Package', quantity: 1, weight: '25 lbs' },
      { name: 'Documents', quantity: 5, weight: '1 lb' }
    ],
    price: '75.50',
    notes: 'Handle with care',
    createdAt: '2025-04-17T15:30:00Z',
    updatedAt: '2025-04-17T15:30:00Z'
  },
  {
    id: 'job-002',
    customerId: 'customer-123',
    carrierId: 'carrier-123',
    status: 'in_transit',
    pickupAddress: '789 Oak St, San Francisco, CA',
    deliveryAddress: '101 Pine St, San Francisco, CA',
    pickupTime: '2025-04-19T14:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Furniture', quantity: 2, weight: '150 lbs' }
    ],
    price: '120.00',
    notes: 'Second floor delivery',
    createdAt: '2025-04-17T09:15:00Z',
    updatedAt: '2025-04-18T10:30:00Z'
  },
  {
    id: 'job-003',
    customerId: 'customer-123',
    carrierId: null,
    status: 'requested',
    pickupAddress: '222 Cedar St, San Francisco, CA',
    deliveryAddress: '333 Maple Ave, San Francisco, CA',
    pickupTime: '2025-04-20T09:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Electronics', quantity: 3, weight: '15 lbs' }
    ],
    price: '65.75',
    notes: 'Fragile items',
    createdAt: '2025-04-18T08:00:00Z',
    updatedAt: '2025-04-18T08:00:00Z'
  },
  {
    id: 'job-004',
    customerId: 'customer-123',
    carrierId: 'carrier-456',
    status: 'delivered',
    pickupAddress: '444 Elm St, San Francisco, CA',
    deliveryAddress: '555 Walnut Dr, San Francisco, CA',
    pickupTime: '2025-04-15T11:00:00Z',
    deliveryTime: '2025-04-15T14:30:00Z',
    items: [
      { name: 'Books', quantity: 20, weight: '30 lbs' }
    ],
    price: '45.25',
    notes: '',
    createdAt: '2025-04-14T16:45:00Z',
    updatedAt: '2025-04-15T14:35:00Z'
  }
];

// Mock user data for demo
const MOCK_USERS = {
  'carrier-123': { id: 'carrier-123', name: 'Demo Carrier', email: 'carrier@example.com' },
  'carrier-456': { id: 'carrier-456', name: 'Fast Delivery Inc.', email: 'fast@example.com' }
};

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Redirect if not authenticated or not a customer


    if (user && user.role !== 'customer') {
      router.push('/carrier/dashboard');
      return;
    }

    // Use mock jobs data for demo
    if (user) {
      // Filter jobs for this customer
      const customerJobs = MOCK_JOBS.filter(job => job.customerId === user.id);
      setJobs(customerJobs);
      
      // Filter active and completed jobs
      setActiveJobs(customerJobs.filter(job => 
        job.status === 'requested' || job.status === 'accepted' || job.status === 'in_transit'
      ));
      
      setCompletedJobs(customerJobs.filter(job => 
        job.status === 'delivered' || job.status === 'cancelled'
      ));
    }
  }, [user, isAuthenticated, router]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCarrierName = (carrierId: string | null) => {
    if (!carrierId) return 'Not assigned';
    
    const carrier = MOCK_USERS[carrierId as keyof typeof MOCK_USERS];
    return carrier ? carrier.name : 'Unknown carrier';
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Customer Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Dashboard summary */}
          <div className="px-4 py-8 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Welcome</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {user ? `${user.first_name} ${user.last_name}` : 'Customer'}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{activeJobs.length}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/customer/create-job" className="font-medium text-indigo-700 hover:text-indigo-900">
                      Create new job
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{completedJobs.length}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/customer/jobs" className="font-medium text-indigo-700 hover:text-indigo-900">
                      View all jobs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900">Active Jobs</h2>
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {activeJobs.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Job ID
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Items
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Pickup
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Carrier
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {activeJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {job.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {job.items.map((item, index) => (
                            <div key={index}>
                              {item.name} {item.quantity ? `(${item.quantity})` : ''}
                            </div>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(job.pickupTime)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getCarrierName(job.carrierId)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/customer/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                            View<span className="sr-only">, {job.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 px-4 sm:px-6 lg:px-8">
                  <p className="text-sm text-gray-500">No active jobs found.</p>
                  <div className="mt-6">
                    <Link
                      href="/customer/create-job"
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Create a new job
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
