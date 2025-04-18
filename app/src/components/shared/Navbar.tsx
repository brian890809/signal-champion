'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Format user name from first_name and last_name
  const userName = user ? 
    `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : '';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Shiftly
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user?.role === 'customer' ? (
                  <>
                    <Link 
                      href="/customer/dashboard" 
                      className={`${
                        pathname.includes('/customer/dashboard')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/customer/create-job" 
                      className={`${
                        pathname.includes('/customer/create-job')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Create Job
                    </Link>
                    <Link 
                      href="/customer/jobs" 
                      className={`${
                        pathname.includes('/customer/jobs')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      My Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/carrier/dashboard" 
                      className={`${
                        pathname.includes('/carrier/dashboard')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/carrier/available-jobs" 
                      className={`${
                        pathname.includes('/carrier/available-jobs')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Available Jobs
                    </Link>
                    <Link 
                      href="/carrier/my-jobs" 
                      className={`${
                        pathname.includes('/carrier/my-jobs')
                          ? 'border-indigo-500 text-indigo-700'
                          : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      My Jobs
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {userName} ({user?.role})
                </span>
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
