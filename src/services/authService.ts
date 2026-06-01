import { getSupabase } from '@/lib/supabase'

export type AuthRole = 'admin' | 'staff' | 'customer'

export interface AuthUser {
  id: string
  email: string
  role?: AuthRole
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')
  await supabase.auth.signOut()
}

// Sign up a user (self-service). Returns the auth response from Supabase.
export async function signUp(email: string, password: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

// Create a user and assign a role by inserting a row into `profiles`.
// NOTE: Creating users securely with elevated privileges normally requires a server
// using the service_role key. This function uses client-side `signUp` and then
// writes to `profiles`. In production you may prefer a server endpoint.
export async function createUserWithRole(email: string, password: string, role: AuthRole) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not configured')

  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY. Staff accounts must be created with the admin API.')
  }

  const { createClient } = await import('@supabase/supabase-js')
  const adminClient = createClient(import.meta.env.VITE_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) throw createError

  const userId = createdUser.user?.id
  if (!userId) {
    throw new Error('Failed to retrieve created user id')
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userId, email, role } as never)

  if (profileError) throw profileError

  return { userId }
}
