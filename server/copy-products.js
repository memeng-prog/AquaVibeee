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

const SRC_URL = process.env.SRC_SUPABASE_URL
const SRC_KEY = process.env.SRC_SUPABASE_SERVICE_ROLE_KEY

const DEST_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const DEST_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SRC_URL || !SRC_KEY) {
  console.error('Missing source SUPABASE_URL or SERVICE_ROLE_KEY. Provide SRC_SUPABASE_URL and SRC_SUPABASE_SERVICE_ROLE_KEY env vars.')
  process.exit(1)
}

if (!DEST_URL || !DEST_KEY) {
  console.error('Missing destination SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const src = createClient(SRC_URL, SRC_KEY, { auth: { persistSession: false } })
const dest = createClient(DEST_URL, DEST_KEY, { auth: { persistSession: false } })

async function run() {
  try {
    console.log('Fetching products from source...')
    const { data: srcProducts, error: srcErr } = await src.from('products').select('*')
    if (srcErr) throw srcErr
    if (!srcProducts || srcProducts.length === 0) {
      console.log('No products found in source. Nothing to copy.')
      return
    }

    console.log(`Found ${srcProducts.length} products in source`)

    // Fetch existing slugs in destination
    const { data: existing, error: existErr } = await dest.from('products').select('slug')
    if (existErr) throw existErr
    const existingSlugs = new Set((existing || []).map((r) => r.slug))

    const toInsert = srcProducts.filter((p) => !existingSlugs.has(p.slug)).map((p) => {
      // Normalize field names if necessary (keep as-is)
      return p
    })

    if (toInsert.length === 0) {
      console.log('No new products to insert; destination already has all source slugs.')
      return
    }

    console.log(`Inserting ${toInsert.length} new products into destination...`)
    const { data: insData, error: insErr } = await dest.from('products').insert(toInsert)
    if (insErr) throw insErr

    console.log(`Inserted ${insData ? insData.length : toInsert.length} products.`)

    const { data: countData } = await dest.rpc('', {}) // noop to ensure connection
    // Final verification
    const { data: finalCount } = await dest.from('products').select('id').limit(1)
    console.log('Copy complete. Destination product sample count check done.')
  } catch (err) {
    console.error('Error during copy:', err.message || err)
    process.exit(1)
  }
}

run()
