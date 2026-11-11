// Single shared Supabase client for the browser, using the public publishable key.
import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

export const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey)
