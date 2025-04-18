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

// Mock data for demo
const MOCK_JOBS: Job[] = [
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
    id: 'job-007',
    customerId: 'customer-456',
    carrierId: null,
    status: 'requested',
    pickupAddress: '123 Market St, San Francisco, CA',
    deliveryAddress: '456 Mission St, San Francisco, CA',
    pickupTime: '2025-04-21T10:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Medical Supplies', quantity: 5, weight: '10 lbs' }
    ],
    price: '85.00',
    notes: 'Time-sensitive delivery',
    createdAt: '2025-04-18T09:30:00Z',
    updatedAt: '2025-04-18T09:30:00Z'
  },
  {
    id: 'job-008',
    customerId: 'customer-789',
    carrierId: null,
    status: 'requested',
    pickupAddress: '789 Howard St, San Francisco, CA',
    deliveryAddress: '101 Folsom St, San Francisco, CA',
    pickupTime: '2025-04-22T14:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Catering Food', quantity: 10, weight: '25 lbs' }
    ],
    price: '95.50',
    notes: 'Keep refrigerated',
    createdAt: '2025-04-18T11:15:00Z',
    updatedAt: '2025-04-18T11:15:00Z'
  },
  {
    id: 'job-009',
    customerId: 'customer-321',
    carrierId: null,
    status: 'requested',
    pickupAddress: '222 Bryant St, San Francisco, CA',
    deliveryAddress: '333 Brannan St, San Francisco, CA',
    pickupTime: '2025-04-23T09:00:00Z',
    deliveryTime: null,
    items: [
      { name: 'Legal Documents', quantity: 1, weight: '1 lb' }
    ],
    price: '45.00',
    notes: 'Confidential materials',
    createdAt: '2025-04-18T13:45:00Z',
    updatedAt: '2025-04-18T13:45:00Z'
  },
  {
    id: 'job-010',
    customerId: 'customer-654',
    carrierId: null,
    status: 'requested',
    pickupAddress: '444 Townsend St, San Francisco, CA',
    deliveryAddress: '555 8th St, San Francisco, CA',
    pickupTime: '2025-04-24T11:30:00Z',
    deliveryTime: null,
    items: [
      { name: 'Retail Products', quantity: 15, weight: '30 lbs' }
    ],
    price: '75.25',
    notes: '',
    createdAt: '2025-04-18T15:20:00Z',
    updatedAt: '2025-04-18T15:20:00Z'
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

export default function AvailableJobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>('pickupTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // For demo, always load all available jobs
    setJobs(MOCK_JOBS.filter(job => job.carrierId === null && job.status === 'requested'));
  }, []);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'pickupTime':
        comparison = new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime();
        break;
      case 'price':
        comparison = parseFloat(a.price) - parseFloat(b.price);
        break;
      case 'distance':
        // For demo purposes, we'll just use a random value for distance
        comparison = Math.random() - 0.5;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCustomerName = (customerId: string) => {
    const customer = MOCK_CUSTOMERS[customerId as keyof typeof MOCK_CUSTOMERS];
    return customer ? customer.name : 'Unknown customer';
  };

  const handleAcceptJob = async (jobId: string) => {
    setAcceptingJobId(jobId);
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      setSuccessMessage(`Job ${jobId} accepted successfully! It's now in your active jobs.`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setLoading(false);
      setAcceptingJobId(null);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Available Jobs</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 mb-6 mx-4 sm:mx-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Sort Controls */}
          <div className="px-4 sm:px-0 py-5">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <p className="mt-2 text-sm text-gray-700">
                  Browse available jobs that you can accept for delivery.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link
                  href="/carrier/dashboard"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <span className="text-sm text-gray-700 mr-2 pt-2">Sort by:</span>
              <button
                onClick={() => handleSort('pickupTime')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  sortBy === 'pickupTime'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pickup Time {sortBy === 'pickupTime' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  sortBy === 'price'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('distance')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  sortBy === 'distance'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Distance {sortBy === 'distance' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="mt-4 px-4 sm:px-0">
            {sortedJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedJobs.map((job) => (
                  <div key={job.id} className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Job {job.id}</h3>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                          ${job.price}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Customer:</span> {getCustomerName(job.customerId)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Items:</span>{' '}
                          {job.items.map((item, index) => (
                            <span key={index}>
                              {item.name} {item.quantity ? `(${item.quantity})` : ''}
                              {index < job.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Pickup:</span> {job.pickupAddress}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Delivery:</span> {job.deliveryAddress}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Pickup Time:</span> {formatDate(job.pickupTime)}
                        </p>
                        {job.notes && (
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Notes:</span> {job.notes}
                          </p>
                        )}
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => handleAcceptJob(job.id)}
                          disabled={loading && acceptingJobId === job.id}
                          className="inline-flex items-center justify-center w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {loading && acceptingJobId === job.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Accepting...
                            </>
                          ) : (
                            'Accept Job'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No available jobs</h3>
                <p className="mt-1 text-sm text-gray-500">There are no available jobs at the moment.</p>
                <div className="mt-6">
                  <Link
                    href="/carrier/dashboard"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
