import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtbgziimydcywkdpxljm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Ymd6aWlteWRjeXdrZHB4bGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMTA1NDIsImV4cCI6MjA0NDY4NjU0Mn0.cxTe5PdywpN-dwlsZMZwjN0cQFLR-Ip8ZzqXzUuxHOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);