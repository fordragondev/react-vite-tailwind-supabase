import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

//process.env.SUPABASE_URL,
//process.env.SUPABASE_KEY

export const supabase = createClient(
    supabaseUrl, 
    supabaseAnonKey
);
