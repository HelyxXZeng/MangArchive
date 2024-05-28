import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cukoywyohijrtsxvxhca.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1a295d3lvaGlqcnRzeHZ4aGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwODcwMzgsImV4cCI6MjAyNDY2MzAzOH0.jPeib8CeG0rZ8TKQmK9t4nppl_xcYcLenopeVEZhT7A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})