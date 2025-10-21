// lib/supabaseServerClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // service role key i .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or SERVICE ROLE KEY is missing. Check your .env.local')
}

// Server-side client bypassar RLS
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
