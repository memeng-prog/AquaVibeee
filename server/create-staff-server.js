import http from 'http'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env if present (simple parser, avoids adding dotenv dependency)
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
  // ignore parse errors
}

const PORT = process.env.PORT || 8787
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || process.env.VITE_ADMIN_API_SECRET

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Quick startup validation: attempt a harmless admin call to verify the key
;(async () => {
  try {
    // listUsers requires admin privileges; limit to 1 to be lightweight
    const check = await admin.auth.admin.listUsers({ per_page: 1 })
    if (check?.data) {
      console.log('Service role key validated: admin API reachable')
    } else {
      console.warn('Service role validation returned unexpected shape:', JSON.stringify(check))
    }
  } catch (err) {
    // Provide a clear startup message without echoing the key
    console.error('Service role validation failed at startup. Received error:', err?.message || err)
    console.error('Common causes: wrong project URL, wrong key, or regenerated/rotated key. Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  }
})()

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,apikey,authorization,x-admin-secret',
  })
  res.end(body)
}

function errorMessage(err) {
  if (!err) return 'Unknown error'
  if (typeof err === 'string') return err
  if (typeof err === 'object') {
    return err.message || err.error_description || err.error || JSON.stringify(err) || 'Unknown error'
  }
  return String(err)
}

const GMAIL_EMAIL_PATTERN = /^[^\s@]+@gmail\.com$/i

const server = http.createServer(async (req, res) => {
  function checkAdminSecret() {
    if (!ADMIN_SECRET) return true
    const header = req.headers['x-admin-secret'] || req.headers['x-admin-secret'.toLowerCase()]
    return header === ADMIN_SECRET
  }

  if (req.method === 'OPTIONS') {
    // CORS preflight
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,apikey,authorization,x-admin-secret',
    })
    res.end()
    return
  }

  if (req.url === '/api/create-staff' && req.method === 'POST') {
    console.log('Received create-staff POST')
    if (!checkAdminSecret()) {
      sendJSON(res, 401, { error: 'Missing or invalid admin secret' })
      return
    }
    try {
      let body = ''
      for await (const chunk of req) body += chunk
      const payload = JSON.parse(body || '{}')
      const { email, password, role = 'staff', full_name } = payload
      if (!email || !password) {
        sendJSON(res, 400, { error: 'email and password are required' })
        return
      }

      if (!GMAIL_EMAIL_PATTERN.test(String(email).trim())) {
        sendJSON(res, 400, { error: 'Invalid email address. Use a Gmail address ending in @gmail.com' })
        return
      }

      // Create user via admin API
      const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        console.error('createUser error:', createError)
        sendJSON(res, 500, { error: errorMessage(createError) })
        return
      }

      const userId = createdUser?.user?.id
      if (!userId) {
        sendJSON(res, 500, { error: 'Failed to retrieve created user id' })
        return
      }

      const { error: profileError } = await admin.from('profiles').insert({ id: userId, email, full_name, role })
      if (profileError) {
        console.error('Failed to insert profile row:', profileError)
        sendJSON(res, 500, { error: errorMessage(profileError) })
        return
      }

      console.log('Created user', userId)
      sendJSON(res, 200, { userId })
    } catch (err) {
      console.error('Unexpected server error', err)
      sendJSON(res, 500, { error: errorMessage(err) })
    }

    return
  }

  if (req.url === '/api/set-role' && req.method === 'POST') {
    if (!checkAdminSecret()) {
      sendJSON(res, 401, { error: 'Missing or invalid admin secret' })
      return
    }
    try {
      let body = ''
      for await (const chunk of req) body += chunk
      const payload = JSON.parse(body || '{}')
      const { email, role } = payload
      if (!email || !role) {
        sendJSON(res, 400, { error: 'email and role are required' })
        return
      }

      // Try to update existing profile rows matching the email
      const { data: updated, error: updateError } = await admin
        .from('profiles')
        .update({ role })
        .eq('email', email)
        .select('id,email,role')

      if (updateError) {
        console.error('Failed to update profile role:', updateError)
        sendJSON(res, 500, { error: updateError.message || updateError })
        return
      }

      if (updated && updated.length > 0) {
        sendJSON(res, 200, { updated: true, count: updated.length, rows: updated })
        return
      }

      // If no existing profile was updated, insert a new profile row with the role
      const { data: inserted, error: insertError } = await admin
        .from('profiles')
        .insert({ email, role })
        .select('id,email,role')

      if (insertError) {
        console.error('Failed to insert profile row for set-role:', insertError)
        sendJSON(res, 500, { error: insertError.message || insertError })
        return
      }

      sendJSON(res, 200, { updated: false, inserted: inserted || [] })
      return
    } catch (err) {
      console.error('Unexpected server error in set-role', err)
      sendJSON(res, 500, { error: String(err) })
    }

    return
  }

  if (req.url === '/api/list-staff' && req.method === 'GET') {
    if (!checkAdminSecret()) {
      sendJSON(res, 401, { error: 'Missing or invalid admin secret' })
      return
    }
    try {
      const { data, error } = await admin
        .from('profiles')
        .select('id,email,full_name,role')
        .eq('role', 'staff')

      if (error) {
        console.error('Failed to fetch staff via admin client:', error)
        sendJSON(res, 500, { error: error.message || error })
        return
      }

      sendJSON(res, 200, { data: data || [] })
      return
    } catch (err) {
      console.error('Unexpected error in list-staff', err)
      sendJSON(res, 500, { error: String(err) })
      return
    }
  }

  if (req.url === '/api/delete-user' && req.method === 'POST') {
    if (!checkAdminSecret()) {
      sendJSON(res, 401, { error: 'Missing or invalid admin secret' })
      return
    }
    try {
      let body = ''
      for await (const chunk of req) body += chunk
      const payload = JSON.parse(body || '{}')
      let { id, email } = payload
      if (!id && !email) {
        sendJSON(res, 400, { error: 'id or email is required' })
        return
      }

      // If email provided but no id, look up profile to get id
      if (!id && email) {
        const { data: profiles, error: lookupError } = await admin
          .from('profiles')
          .select('id')
          .eq('email', email)
          .limit(1)

        if (lookupError) {
          console.error('Failed to lookup profile for delete-user:', lookupError)
          sendJSON(res, 500, { error: errorMessage(lookupError) })
          return
        }

        if (!profiles || profiles.length === 0) {
          sendJSON(res, 404, { error: 'No profile found for provided email' })
          return
        }

        id = profiles[0].id
      }

      // Delete profile row first
      const { error: delProfileError } = await admin.from('profiles').delete().eq('id', id)
      if (delProfileError) {
        console.error('Failed to delete profile row:', delProfileError)
        sendJSON(res, 500, { error: errorMessage(delProfileError) })
        return
      }

      // Delete auth user
      try {
        const delAuth = await admin.auth.admin.deleteUser(id)
        // deleteUser doesn't return structured { error } in this client; assume success if no throw
      } catch (e) {
        console.error('Failed to delete auth user:', e)
        // Continue — profile already removed; still report error
        sendJSON(res, 500, { error: errorMessage(e) })
        return
      }

      sendJSON(res, 200, { deleted: true, id })
      return
    } catch (err) {
      console.error('Unexpected server error in delete-user', err)
      sendJSON(res, 500, { error: errorMessage(err) })
      return
    }
  }

  // Not found
  sendJSON(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Staff creation API listening on http://localhost:${PORT}`)
})
