'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our auth context
type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'customer' | 'carrier';
  phone: string | null;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { 
    email: 'customer@example.com', 
    password: 'password123', 
    profile: {
      id: 'customer-123',
      email: 'customer@example.com',
      first_name: 'Demo',
      last_name: 'Customer',
      role: 'customer' as const,
      phone: '555-123-4567'
    }
  },
  { 
    email: 'carrier@example.com', 
    password: 'password123', 
    profile: {
      id: 'carrier-123',
      email: 'carrier@example.com',
      first_name: 'Demo',
      last_name: 'Carrier',
      role: 'carrier' as const,
      phone: '555-987-6543'
    }
  }
];

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async (email: string, password: string) => null,
  logout: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
          const userData = JSON.parse(storedUser) as UserProfile;
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Session found, user:', userData);
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      setIsLoading(true);
      
      // Find matching demo account
      const account = DEMO_ACCOUNTS.find(acc => 
        acc.email.toLowerCase() === email.toLowerCase() && 
        acc.password === password
      );
      
      if (account) {
        // Store user info in localStorage for demo
        localStorage.setItem('user', JSON.stringify(account.profile));
        localStorage.setItem('isAuthenticated', 'true');
        
        setUser(account.profile);
        setIsAuthenticated(true);
        return account.profile;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
