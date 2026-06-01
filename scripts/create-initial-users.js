/*
  Run this locally to create initial auth users and profiles in Supabase.
  Usage:
    1. npm install @supabase/supabase-js
    2. Set env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (do NOT share)
    3. node scripts/create-initial-users.js

  NOTE: The DB schema from supabase/schema.sql must be applied first (profiles table).
*/

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const users = [
  { email: 'jai@gmail.com', password: '212121', role: 'staff', full_name: 'Jai' },
  { email: 'jireh@gmail.com', password: 'faith', role: 'admin', full_name: 'Jireh' },
]

// Optional: set CREATE_ONLY to 'staff' or 'admin' to create a single account
const createOnly = process.env.CREATE_ONLY
const toCreate = createOnly ? users.filter((u) => u.role === createOnly) : users

async function main() {
  for (const u of toCreate) {
    try {
      // If a profile already exists for this email, skip creating the auth user
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('email', u.email).single()
      if (existingProfile && existingProfile.id) {
        console.log('Profile already exists for', u.email, '- skipping create')
        continue
      }
      // Create auth user using admin API
      const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      })

      if (createError) {
        console.error('Failed to create user', u.email, createError.message)
        continue
      }

      const userId = createdUser.id
      console.log('Created user', u.email, 'id=', userId)

      // Upsert profile with role (idempotent)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, email: u.email, full_name: u.full_name, role: u.role }, { onConflict: 'id' })

      if (profileError) {
        console.error('Failed to upsert profile for', u.email, profileError.message)
      } else {
        console.log('Upserted profile for', u.email)
      }
    } catch (err) {
      console.error('Unexpected error for', u.email, err.message || err)
    }
  }
}

main().then(() => console.log('Done')).catch((e) => console.error(e))
