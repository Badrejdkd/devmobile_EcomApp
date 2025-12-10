import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cdejiruheqjqtqrublxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkZWppcnVoZXFqcXRxcnVibHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDQxODEsImV4cCI6MjA4MDg4MDE4MX0.hBSv97o4b58IOtQwfEB1OyNiN9nmIsWOC1l6V3NgA4Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
