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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!checkSecret(req, res)) return

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const { id, email } = req.body || {}
    let targetId = id
    if (!targetId && email) {
      const { data } = await supabase.from('profiles').select('id').eq('email', email).single()
      targetId = data?.id
    }

    if (!targetId) return res.status(400).json({ error: 'id or email required' })

    // delete profile row
    const { error: profileErr } = await supabase.from('profiles').delete().eq('id', targetId)
    if (profileErr) return res.status(500).json({ error: profileErr.message || profileErr })

    // delete auth user
    const { error: authErr } = await supabase.auth.admin.deleteUser(targetId)
    if (authErr) return res.status(500).json({ error: authErr.message || authErr })

    return res.status(200).json({ deleted: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected error' })
  }
}
