import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET

function checkSecret(req, res) {
  if (ADMIN_API_SECRET) {
    const header = req.headers['x-admin-secret'] || req.headers['X-Admin-Secret']
    if (!header || header !== ADMIN_API_SECRET) {
      res.status(401).json({ error: 'Unauthorized' })
      return false
    }
  }
  return true
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!checkSecret(req, res)) return

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const body = req.body || {}
    const { email, password, full_name = '', role = 'staff' } = body

    if (!email) return res.status(400).json({ error: 'email is required' })
    if (!GMAIL_EMAIL_PATTERN.test(String(email).trim())) {
      return res.status(400).json({ error: 'Invalid email address. Use a Gmail address ending in @gmail.com' })
    }

    // create auth user
    const { data: userData, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: password || Math.random().toString(36).slice(2),
      email_confirm: true,
    })

    if (createErr) {
      return res.status(500).json({ error: errorMessage(createErr) })
    }

    const user = userData.user
    // insert profile
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: user.id,
      email,
      full_name,
      role,
    })

    if (profileErr) {
      return res.status(500).json({ error: errorMessage(profileErr) })
    }

    return res.status(200).json({ created: true, id: user.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: errorMessage(err) })
  }
}
