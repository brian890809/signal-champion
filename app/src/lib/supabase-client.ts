import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// Hardcoded values for demo purposes
export const supabase = createClient<Database>(
  'https://gpulijjaqdbkbpytnrus.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdWxpamphcWRia2JweXRucnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTI1MDksImV4cCI6MjA2MDU4ODUwOX0.Wfqly86HSrqqqu6lts3KFwDomUGHtl9CLB5g71c-E6I'
);
