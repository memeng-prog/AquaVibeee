import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getSupabase } from '@/lib/supabase'

type User = { id: string; email: string; full_name?: string; role: 'admin' | 'staff' | 'customer' }
type ProfileRole = User['role']
type ProfileData = { role?: ProfileRole; full_name?: string } | null

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    // Check current session and fetch profile
    const loadUser = async () => {
        console.debug('[Auth] loadUser: fetching session')
      const sessionRes = await supabase.auth.getSession()
      const session = sessionRes?.data?.session
        console.debug('[Auth] sessionRes:', sessionRes)

      if (session?.user) {
          console.debug('[Auth] SIGNED_IN event, fetching profile for', session.user!.id)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, role, full_name')
          .eq('id', session.user.id)
          .single()

        const profileData = profile as ProfileData
        const role = profileData?.role ?? 'customer'
        setUser({ id: session.user.id, email: session.user.email ?? '', role, full_name: profileData?.full_name })
          console.debug('[Auth] profile:', profile)
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        ;(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, role, full_name')
            .eq('id', session.user!.id)
            .single()

          const profileData = profile as ProfileData
          const role = profileData?.role ?? 'customer'
          setUser({ id: session.user!.id, email: session.user!.email ?? '', role, full_name: profileData?.full_name })
        })()
      }

      if (event === 'SIGNED_OUT') {
          console.debug('[Auth] SIGNED_OUT')
        setUser(null)
      }
    })

    return () => {
      // listener can be undefined in some environments; guard and call unsubscribe if available
      try {
        // subscription may be an object with an unsubscribe method
        // or may itself be a function depending on client version
        const sub: any = listener?.subscription
        if (typeof sub === 'function') {
          sub()
        } else if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe()
        }
      } catch (err) {
        // ignore cleanup errors
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase not configured')

    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      throw error
    }

    // Fetch profile
    const userId = data.user?.id
    if (userId) {
      const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', userId).single()
      const profileData = profile as ProfileData
      const role = profileData?.role ?? 'customer'
      setUser({ id: userId, email, role, full_name: profileData?.full_name })
    }

    setLoading(false)
  }

  const logout = async () => {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase not configured')
    await supabase.auth.signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
