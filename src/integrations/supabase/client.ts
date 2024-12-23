import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://gywkgpwoibueucgewvvs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5d2tncHdvaWJ1ZXVjZ2V3dnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTA3NDMsImV4cCI6MjA0OTA2Njc0M30.Y4nOKWZzIu85qbFNPM_n_Fc8TXXsdrZ4oNsAIG_dOyI";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});