'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    itemQuantity: '1',
    itemWeight: '',
    pickupAddress: '',
    deliveryAddress: '',
    pickupDate: '',
    pickupTime: '',
    notes: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For demo purposes, we'll just simulate a successful job creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Job created successfully! Redirecting to dashboard...');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/customer/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Create New Job</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {successMessage ? (
                <div className="rounded-md bg-green-50 p-4 mb-6">
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
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Item Details */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Item Details</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                          Item Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="itemName"
                            id="itemName"
                            required
                            value={formData.itemName}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="itemQuantity"
                            id="itemQuantity"
                            min="1"
                            required
                            value={formData.itemQuantity}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="itemWeight" className="block text-sm font-medium text-gray-700">
                          Weight (optional)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="itemWeight"
                            id="itemWeight"
                            placeholder="e.g., 5 lbs"
                            value={formData.itemWeight}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pickup and Delivery */}
                  <div className="pt-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Pickup & Delivery</h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
                          Pickup Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="pickupAddress"
                            id="pickupAddress"
                            required
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                          Delivery Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="deliveryAddress"
                            id="deliveryAddress"
                            required
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">
                          Pickup Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="pickupDate"
                            id="pickupDate"
                            required
                            value={formData.pickupDate}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">
                          Pickup Time
                        </label>
                        <div className="mt-1">
                          <input
                            type="time"
                            name="pickupTime"
                            id="pickupTime"
                            required
                            value={formData.pickupTime}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="pt-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Additional Information</h3>
                    <div className="mt-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes (optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Special handling instructions, fragile items, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-5">
                    <Link
                      href="/customer/dashboard"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Job'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
