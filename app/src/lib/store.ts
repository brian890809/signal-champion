import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Create a direct instance of the Supabase client here to avoid import issues
const supabase = createClient(
  'https://gpulijjaqdbkbpytnrus.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdWxpamphcWRia2JweXRucnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTI1MDksImV4cCI6MjA2MDU4ODUwOX0.Wfqly86HSrqqqu6lts3KFwDomUGHtl9CLB5g71c-E6I'
);

// Auth functions
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  email: string, 
  password: string, 
  role: 'customer' | 'carrier', 
  firstName: string, 
  lastName: string
) => {
  try {
    // Just focus on creating the auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
          email: email
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    // For now, just return the auth data without trying to create a profile
    // The profile can be created later when the user confirms their email
    return authData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    // First try to get user metadata from auth
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    
    if (userData?.user?.user_metadata) {
      return {
        id: userId,
        email: userData.user.email,
        first_name: userData.user.user_metadata.first_name,
        last_name: userData.user.user_metadata.last_name,
        role: userData.user.user_metadata.role,
        phone: userData.user.phone || null
      };
    }
    
    // Fallback to profiles table if metadata not available
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Get user profile error:', error);
      // Return a minimal profile with available data
      return {
        id: userId,
        email: '',
        first_name: '',
        last_name: '',
        role: 'customer',
        phone: null
      };
    }
    
    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    // Return a minimal profile with available data
    return {
      id: userId,
      email: '',
      first_name: '',
      last_name: '',
      role: 'customer',
      phone: null
    };
  }
};

// Job functions
export const getAvailableJobs = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_jobs');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Get available jobs error:', error);
    throw error;
  }
};

export const getMyJobs = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_my_jobs');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Get my jobs error:', error);
    throw error;
  }
};

export const createJob = async (
  title: string,
  description: string,
  pickupAddress: string,
  pickupLat: number,
  pickupLng: number,
  deliveryAddress: string,
  deliveryLat: number,
  deliveryLng: number,
  items: string[],
  price: number
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        customer_id: user.user.id,
        title,
        description,
        pickup_address: pickupAddress,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        delivery_address: deliveryAddress,
        delivery_lat: deliveryLat,
        delivery_lng: deliveryLng,
        items,
        price,
        status: 'requested'
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Create job error:', error);
    throw error;
  }
};

export const updateJobStatus = async (
  jobId: string, 
  status: 'requested' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled'
) => {
  try {
    const { data, error } = await supabase
      .rpc('update_job_status', {
        job_id: jobId,
        new_status: status
      });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Update job status error:', error);
    throw error;
  }
};

export const acceptJob = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('accept_job', {
        job_id: jobId
      });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Accept job error:', error);
    throw error;
  }
};

// Tracking functions
export const addTrackingUpdate = async (
  jobId: string,
  lat: number,
  lng: number,
  status?: string,
  note?: string
) => {
  try {
    const { data, error } = await supabase
      .from('tracking_updates')
      .insert({
        job_id: jobId,
        lat,
        lng,
        status,
        note
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Add tracking update error:', error);
    throw error;
  }
};

export const getTrackingUpdates = async (jobId: string) => {
  try {
    const { data, error } = await supabase
      .from('tracking_updates')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Get tracking updates error:', error);
    throw error;
  }
};

// Payment functions
export const createPayment = async (
  jobId: string,
  carrierId: string,
  amount: number,
  paymentMethod: string
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        job_id: jobId,
        customer_id: user.user.id,
        carrier_id: carrierId,
        amount,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Create payment error:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'refunded' | 'failed',
  transactionId?: string
) => {
  try {
    const updateData: any = { status };
    
    if (transactionId) {
      updateData.transaction_id = transactionId;
    }
    
    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Update payment status error:', error);
    throw error;
  }
};

// Review functions
export const createReview = async (
  jobId: string,
  revieweeId: string,
  rating: number,
  comment?: string
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        job_id: jobId,
        reviewer_id: user.user.id,
        reviewee_id: revieweeId,
        rating,
        comment
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

export const getReviewsForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, jobs(*), profiles(*)')
      .eq('reviewee_id', userId);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Get reviews for user error:', error);
    throw error;
  }
};