'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { 
    email: 'customer@example.com', 
    password: 'password123', 
    role: 'customer',
    profile: {
      id: 'customer-123',
      email: 'customer@example.com',
      first_name: 'Demo',
      last_name: 'Customer',
      role: 'customer',
      phone: '555-123-4567'
    }
  },
  { 
    email: 'carrier@example.com', 
    password: 'password123', 
    role: 'carrier',
    profile: {
      id: 'carrier-123',
      email: 'carrier@example.com',
      first_name: 'Demo',
      last_name: 'Carrier',
      role: 'carrier',
      phone: '555-987-6543'
    }
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find matching demo account
      const account = DEMO_ACCOUNTS.find(acc => 
        acc.email.toLowerCase() === email.toLowerCase() && 
        acc.password === password
      );
      
      if (account) {
        // Store user info in localStorage for demo
        localStorage.setItem('user', JSON.stringify(account.profile));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect based on user role
        router.push(account.role === 'customer' ? '/customer/dashboard' : '/carrier/dashboard');
      } else {
        setError('Invalid email or password. Please use one of the demo accounts.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6 border border-gray-200 p-6 rounded-lg" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-700">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</h3>
          <div className="border border-gray-200 p-4 rounded-md text-xs">
            <p className="mb-1 text-gray-600">For testing, use these demo accounts:</p>
            <ul className="list-disc pl-5 space-y-1">
              {DEMO_ACCOUNTS.map((cred, index) => (
                <li key={index}>
                  <button 
                    onClick={() => setDemoCredentials(cred.email, cred.password)}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    {cred.email}
                  </button>
                  <span className="text-gray-600"> ({cred.role})</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-gray-600">Click on an email to auto-fill the form. Password will be filled automatically.</p>
            <p className="mt-2 text-gray-600 font-semibold">All demo accounts use password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
