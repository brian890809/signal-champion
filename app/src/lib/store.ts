import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Auth functions
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const register = async (
  email: string, 
  password: string, 
  role: 'customer' | 'carrier', 
  firstName: string, 
  lastName: string
) => {
  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) {
    throw authError;
  }
  
  // 2. Create the profile with role information
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      
    if (profileError) {
      throw profileError;
    }
  }
  
  return authData;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Job functions
export const getAvailableJobs = async () => {
  const { data, error } = await supabase
    .rpc('get_available_jobs');
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const getMyJobs = async () => {
  const { data, error } = await supabase
    .rpc('get_my_jobs');
    
  if (error) {
    throw error;
  }
  
  return data;
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
};

export const updateJobStatus = async (
  jobId: string, 
  status: 'requested' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled'
) => {
  const { data, error } = await supabase
    .rpc('update_job_status', {
      job_id: jobId,
      new_status: status
    });
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const acceptJob = async (jobId: string) => {
  const { data, error } = await supabase
    .rpc('accept_job', {
      job_id: jobId
    });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Tracking functions
export const addTrackingUpdate = async (
  jobId: string,
  lat: number,
  lng: number,
  status?: string,
  note?: string
) => {
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
};

export const getTrackingUpdates = async (jobId: string) => {
  const { data, error } = await supabase
    .from('tracking_updates')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  return data;
};

// Payment functions
export const createPayment = async (
  jobId: string,
  carrierId: string,
  amount: number,
  paymentMethod: string
) => {
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
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'refunded' | 'failed',
  transactionId?: string
) => {
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
};

// Review functions
export const createReview = async (
  jobId: string,
  revieweeId: string,
  rating: number,
  comment?: string
) => {
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
};

export const getReviewsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, jobs(*), profiles(*)')
    .eq('reviewee_id', userId);
    
  if (error) {
    throw error;
  }
  
  return data;
};