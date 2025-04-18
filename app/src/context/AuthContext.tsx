'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as supabaseLogin, logout as supabaseLogout, getCurrentUser, getUserProfile } from '@/lib/store';
import { supabase } from '@/lib/supabase-client';

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
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          const profile = await getUserProfile(currentUser.id);
          setUser(profile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const profile = await getUserProfile(session.user.id);
            setUser(profile);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    checkSession();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      setIsLoading(true);
      const { user: authUser } = await supabaseLogin(email, password);
      
      if (authUser) {
        const profile = await getUserProfile(authUser.id);
        setUser(profile);
        setIsAuthenticated(true);
        return profile;
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
      await supabaseLogout();
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
