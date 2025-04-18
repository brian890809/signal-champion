// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'carrier';
  phone: string;
  vehicleInfo?: {
    type: string;
    capacity: string;
  };
  rating: number;
}

export interface Item {
  name: string;
  dimensions?: string;
  weight?: string;
  quantity?: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Tracking {
  currentLocation: Location;
  lastUpdated: string;
}

export interface Payment {
  status: 'unpaid' | 'pending' | 'paid';
  amount: number;
  fakeTxnId: string | null;
}

export interface Job {
  id: string;
  customerId: string;
  carrierId: string | null;
  items: Item[];
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  status: 'requested' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  tracking: Tracking | null;
  payment: Payment;
  createdAt: string;
}

export interface TrackingUpdate {
  jobId: string;
  timestamp: string;
  location: Location;
  status: string;
}

export interface PaymentLog {
  id: string;
  jobId: string;
  from: string;
  to: string;
  amount: number;
  status: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface JobFormData {
  items: Item[];
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
}
