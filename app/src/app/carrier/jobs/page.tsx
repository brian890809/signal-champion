'use client';

import React, { useState, useEffect } from 'react';
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
  deliveryAddress: string;
  pickupTime: string;
  deliveryTime: string | null;
  status: 'requested' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  price: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for demo - same as dashboard
const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    customerId: 'customer-123',
    carrierId: 'carrier-123',
    status: 'accepted',
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
    customerId: 'customer-456',
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
    id: 'job-004',
    customerId: 'customer-789',
    carrierId: 'carrier-123',
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
  },
  {
    id: 'job-005',
    customerId: 'customer-321',
    carrierId: 'carrier-123',
    status: 'delivered',
    pickupAddress: '777 Broadway, San Francisco, CA',
    deliveryAddress: '888 Mission St, San Francisco, CA',
    pickupTime: '2025-04-10T09:00:00Z',
    deliveryTime: '2025-04-10T12:30:00Z',
    items: [
      { name: 'Office Supplies', quantity: 10, weight: '15 lbs' }
    ],
    price: '35.00',
    notes: 'Deliver to reception',
    createdAt: '2025-04-09T14:30:00Z',
    updatedAt: '2025-04-10T12:35:00Z'
  },
  {
    id: 'job-006',
    customerId: 'customer-654',
    carrierId: 'carrier-123',
    status: 'cancelled',
    pickupAddress: '999 Valencia St, San Francisco, CA',
    deliveryAddress: '111 Castro St, San Francisco, CA',
    pickupTime: '2025-04-05T15:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Artwork', quantity: 1, weight: '5 lbs' }
    ],
    price: '85.00',
    notes: 'Fragile artwork, handle with extreme care',
    createdAt: '2025-04-04T10:15:00Z',
    updatedAt: '2025-04-04T16:20:00Z'
  }
];

// Mock customer data for demo
const MOCK_CUSTOMERS = {
  'customer-123': { id: 'customer-123', name: 'John Doe', email: 'john@example.com' },
  'customer-456': { id: 'customer-456', name: 'Jane Smith', email: 'jane@example.com' },
  'customer-789': { id: 'customer-789', name: 'Bob Johnson', email: 'bob@example.com' },
  'customer-321': { id: 'customer-321', name: 'Alice Brown', email: 'alice@example.com' },
  'customer-654': { id: 'customer-654', name: 'Charlie Wilson', email: 'charlie@example.com' }
};

export default function CarrierJobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    // For demo, always use the mock jobs
    const carrierJobs = MOCK_JOBS.filter(job => job.carrierId === 'carrier-123');
    setJobs(carrierJobs);
  }, []);

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

  const getCustomerName = (customerId: string) => {
    const customer = MOCK_CUSTOMERS[customerId as keyof typeof MOCK_CUSTOMERS];
    return customer ? customer.name : 'Unknown customer';
  };

  const filteredJobs = () => {
    if (activeFilter === 'all') {
      return jobs;
    }
    return jobs.filter(job => job.status === activeFilter);
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">My Jobs</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Filter Controls */}
          <div className="px-4 sm:px-0 py-5">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <p className="mt-2 text-sm text-gray-700">
                  A list of all your jobs including their status, pickup time, and customer information.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link
                  href="/carrier/available-jobs"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Find new jobs
                </Link>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('accepted')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === 'accepted'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setActiveFilter('in_transit')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === 'in_transit'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                In Transit
              </button>
              <button
                onClick={() => setActiveFilter('delivered')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setActiveFilter('cancelled')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeFilter === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="mt-4 px-4 sm:px-0">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {filteredJobs().length > 0 ? (
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
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredJobs().map((job) => (
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
                          {getCustomerName(job.customerId)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${job.price}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/carrier/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                            View<span className="sr-only">, {job.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 px-4 sm:px-6 lg:px-8">
                  <p className="text-sm text-gray-500">No jobs found matching your filter.</p>
                  <div className="mt-6">
                    <Link
                      href="/carrier/available-jobs"
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Find available jobs
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
