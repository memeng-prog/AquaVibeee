import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  try {
    // Try a harmless admin call: list users (limit 1)
    const res = await supabase.auth.admin.listUsers({ per_page: 1 })
    console.log('OK — service key works. Sample response:')
    console.log(JSON.stringify(res, null, 2))
  } catch (err) {
    console.error('Service key test failed:', err.message || err)
    process.exit(2)
  }
}

main()
