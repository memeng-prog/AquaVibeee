import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env (simple parser)
try {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envRaw = fs.readFileSync(envPath, 'utf8')
    envRaw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eq = trimmed.indexOf('=')
      if (eq === -1) return
      const key = trimmed.substring(0, eq).trim()
      let val = trimmed.substring(eq + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    })
  }
} catch (e) {
  // ignore
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function run() {
  try {
    const out = {}

    // Fetch staff
    const { data: staff, error: staffErr } = await admin.from('profiles').select('id,email,full_name,role').in('role', ['staff'])
    if (staffErr) {
      out.staffError = staffErr.message || String(staffErr)
    } else {
      out.staff = staff || []
    }

    // Fetch admins
    const { data: admins, error: adminErr } = await admin.from('profiles').select('id,email,full_name,role').in('role', ['admin'])
    if (adminErr) {
      out.adminsError = adminErr.message || String(adminErr)
    } else {
      out.admins = admins || []
    }

    // Check products existence by attempting a lightweight select
    try {
      const { data: p, error: pErr } = await admin.from('products').select('id').limit(1)
      if (pErr) {
        out.productsExists = false
        out.productsError = pErr.message || String(pErr)
      } else {
        out.productsExists = true
        out.productsSample = p || []
      }
    } catch (e) {
      out.productsExists = false
      out.productsError = String(e)
    }

    console.log(JSON.stringify(out, null, 2))
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(1)
  }
}

run()
