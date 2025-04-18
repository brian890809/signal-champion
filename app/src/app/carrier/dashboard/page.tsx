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
  }
];

// Mock available jobs for demo
const AVAILABLE_JOBS: Job[] = [
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
  }
];

// Mock customer data for demo
const MOCK_CUSTOMERS = {
  'customer-123': { id: 'customer-123', name: 'John Doe', email: 'john@example.com' },
  'customer-456': { id: 'customer-456', name: 'Jane Smith', email: 'jane@example.com' },
  'customer-789': { id: 'customer-789', name: 'Bob Johnson', email: 'bob@example.com' }
};

export default function CarrierDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // For demo, always use the mock data
    // Filter active jobs for this carrier
    setActiveJobs(MOCK_JOBS.filter(job => job.carrierId === 'carrier-123'));
    
    // Set available jobs
    setAvailableJobs(AVAILABLE_JOBS);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCustomerName = (customerId: string) => {
    const customer = MOCK_CUSTOMERS[customerId as keyof typeof MOCK_CUSTOMERS];
    return customer ? customer.name : 'Unknown customer';
  };

  const handleAcceptJob = async (jobId: string) => {
    setIsAccepting(jobId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setAvailableJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // Show success message
      setSuccessMessage(`Job ${jobId} accepted successfully!`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setIsAccepting(null);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Carrier Dashboard</h1>
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

          {/* Active Jobs Section */}
          <div className="px-4 sm:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">My Active Jobs</h2>
                <p className="mt-2 text-sm text-gray-700">
                  A list of your current active jobs that need to be delivered.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link
                  href="/carrier/jobs"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  View all jobs
                </Link>
              </div>
            </div>
            
            <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {activeJobs.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Job ID
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Pickup
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
                    {activeJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {job.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getCustomerName(job.customerId)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(job.pickupTime)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            job.status === 'accepted' 
                              ? 'bg-blue-100 text-blue-800' 
                              : job.status === 'in_transit'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
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
                <div className="text-center py-6 px-4 sm:px-6 lg:px-8">
                  <p className="text-sm text-gray-500">You don't have any active jobs at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Jobs Section */}
          <div className="mt-10 px-4 sm:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Available Jobs</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Browse available jobs that you can accept for delivery.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Link
                  href="/carrier/available-jobs"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  View all available jobs
                </Link>
              </div>
            </div>
            
            <div className="mt-6">
              {availableJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableJobs.slice(0, 3).map((job) => (
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
                        </div>
                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => handleAcceptJob(job.id)}
                            disabled={isAccepting === job.id}
                            className="inline-flex items-center justify-center w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            {isAccepting === job.id ? (
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
                <div className="text-center py-6 px-4 sm:px-6 lg:px-8">
                  <p className="text-sm text-gray-500">There are no available jobs at the moment.</p>
                </div>
              )}
              
              {availableJobs.length > 3 && (
                <div className="mt-6 text-center">
                  <Link
                    href="/carrier/available-jobs"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    View all {availableJobs.length} available jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-10 px-4 sm:px-0">
            <h2 className="text-xl font-semibold text-gray-900">Your Statistics</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{activeJobs.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jobs Completed</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">24</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">$1,250.75</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
